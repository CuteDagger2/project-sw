const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const { sendMail } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const LOCKOUT_SECONDS = 60; // temporary lock duration after 3 failed attempts

// Predefined security questions
const SECURITY_QUESTIONS = [
  "What was the name of your first pet?",
  "What city were you born in?",
  "What was your mother's maiden name?",
  "What was the name of your elementary school?",
  "What was your childhood nickname?",
  "What was the make of your first car?",
  "What was your favorite subject in high school?",
  "What is the name of your favorite teacher?"
];

// Register (user or organization)
router.post('/register', async (req, res) => {
  try {
    const { email, password, type, orgName, securityQuestion, answerOptions, correctAnswerIndex } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    
    // Validate security question fields (optional for backward compatibility)
    let securityQuestionData = null;
    if (securityQuestion && answerOptions && correctAnswerIndex !== undefined) {
      if (!Array.isArray(answerOptions) || answerOptions.length !== 4) {
        return res.status(400).json({ error: 'Must provide exactly 4 answer options' });
      }
      
      if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
        return res.status(400).json({ error: 'Correct answer index must be between 0 and 3' });
      }
      
      // Validate that the selected question is from predefined list
      if (!SECURITY_QUESTIONS.includes(securityQuestion)) {
        return res.status(400).json({ error: 'Invalid security question' });
      }
      
      securityQuestionData = {
        securityQuestion,
        answerOptions,
        correctAnswerIndex
      };
    }

    const db = getDb();
    await db.read();
    const existing = db.data.users.find(u => u.email === email);
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const id = ++db.data.lastIds.users;
    const user = { 
      id, 
      email, 
      passwordHash, 
      type: type || 'user', 
      orgName: orgName || null, 
      failedAttempts: 0, 
      lockUntil: 0,
      ...(securityQuestionData || {})
    };
    db.data.users.push(user);
    await db.write();
    res.json({ ok: true, user: { id: user.id, email: user.email, type: user.type, orgName: user.orgName } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const db = getDb();
  await db.read();
  const user = db.data.users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const now = Math.floor(Date.now() / 1000);
    if (user.lockUntil && user.lockUntil > now) {
      return res.status(429).json({ error: 'Account temporarily locked. Try again later.' , lockUntil: user.lockUntil});
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const failed = (user.failedAttempts || 0) + 1;
      const updates = { failedAttempts: failed };
      if (failed >= 3) {
        updates.lockUntil = now + LOCKOUT_SECONDS;
        // send email to attempted address
        try {
          await sendMail(email, 'Multiple failed login attempts', `There were ${failed} failed login attempts to your account. If this wasn't you, please contact support.`, null);
        } catch (e) {
          console.error('Email error', e);
        }
      }
      const idx = db.data.users.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        db.data.users[idx].failedAttempts = updates.failedAttempts || 0;
        db.data.users[idx].lockUntil = updates.lockUntil || 0;
        await db.write();
      }

      return res.status(400).json({ error: 'Invalid credentials', attempts: failed });
    }

    // success - reset failed attempts but don't generate token yet
    const idx2 = db.data.users.findIndex(u => u.id === user.id);
    if (idx2 >= 0) {
      db.data.users[idx2].failedAttempts = 0;
      db.data.users[idx2].lockUntil = 0;
      await db.write();
    }

    // Check if user has security question configured
    if (!user.securityQuestion || !user.answerOptions) {
      // For backward compatibility, return JWT token immediately for users without security questions
      const payload = { id: user.id, email: user.email, type: user.type, orgName: user.orgName };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
      
      return res.json({ 
        ok: true, 
        token, 
        user: payload,
        requiresSecurityQuestion: false
      });
    }

    // Return security question for second authentication step
    res.json({ 
      ok: true, 
      requiresSecurityQuestion: true,
      userId: user.id,
      securityQuestion: user.securityQuestion,
      answerOptions: user.answerOptions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get available security questions
router.get('/security-questions', (req, res) => {
  res.json({ questions: SECURITY_QUESTIONS });
});

// Verify security question answer
router.post('/verify-security', async (req, res) => {
  try {
    const { userId, selectedAnswerIndex } = req.body;
    
    if (!userId || selectedAnswerIndex === undefined) {
      return res.status(400).json({ error: 'Missing userId or selectedAnswerIndex' });
    }
    
    if (selectedAnswerIndex < 0 || selectedAnswerIndex > 3) {
      return res.status(400).json({ error: 'Invalid answer index' });
    }

    const db = getDb();
    await db.read();
    const user = db.data.users.find(u => u.id === parseInt(userId));
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.securityQuestion || !user.answerOptions || user.correctAnswerIndex === undefined) {
      return res.status(500).json({ error: 'Security question not configured for this user' });
    }
    
    // Check if the selected answer matches the correct answer
    if (selectedAnswerIndex === user.correctAnswerIndex) {
      // Generate JWT token for successful authentication
      const payload = { id: user.id, email: user.email, type: user.type, orgName: user.orgName };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
      
      res.json({ 
        ok: true, 
        token, 
        user: payload 
      });
    } else {
      // Wrong answer - increment failed attempts and potentially lock account
      const failed = (user.failedAttempts || 0) + 1;
      const now = Math.floor(Date.now() / 1000);
      const updates = { failedAttempts: failed };
      
      if (failed >= 3) {
        updates.lockUntil = now + LOCKOUT_SECONDS;
        // Send email notification
        try {
          await sendMail(user.email, 'Multiple failed security question attempts', 
            `There were ${failed} failed security question attempts to your account. If this wasn't you, please contact support.`, null);
        } catch (e) {
          console.error('Email error', e);
        }
      }
      
      const idx = db.data.users.findIndex(u => u.id === user.id);
      if (idx >= 0) {
        db.data.users[idx].failedAttempts = updates.failedAttempts || 0;
        db.data.users[idx].lockUntil = updates.lockUntil || 0;
        await db.write();
      }
      
      return res.status(403).json({ 
        error: 'Incorrect security answer', 
        attempts: failed,
        locked: failed >= 3,
        lockUntil: updates.lockUntil || 0
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
