const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// Create reservation (simple flow)
router.post('/', (req, res) => {
  try {
    (async () => {
      const { eventId, fullName, email, phone, seats } = req.body;
      if (!eventId || !fullName || !email) return res.status(400).json({ error: 'Missing fields' });

      const db = getDb();
      await db.read();
      const ev = db.data.events.find(e => e.id === Number(eventId));
      if (!ev) return res.status(404).json({ error: 'Event not found' });
      if (ev.capacity < (seats || 1)) return res.status(400).json({ error: 'Not enough seats available' });

      const id = ++db.data.lastIds.reservations;
      const reservation = { id, eventId: Number(eventId), userEmail: email, fullName, phone: phone || null, reservedAt: Math.floor(Date.now()/1000), seats: seats || 1, paymentStatus: 'paid' };
      db.data.reservations.push(reservation);
      // decrement capacity
      ev.capacity = ev.capacity - (seats || 1);
      await db.write();
      res.json({ ok: true, reservation });
    })();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List reservations (filter by email)
router.get('/', (req, res) => {
  (async () => {
    try {
      const email = req.query.email;
      const db = getDb();
      await db.read();
      let rows = email ? db.data.reservations.filter(r => r.userEmail === email) : db.data.reservations;
      
      // Enrich reservations with event details
      const enrichedReservations = rows.map(reservation => {
        const event = db.data.events.find(e => e.id === reservation.eventId);
        if (event) {
          return {
            ...reservation,
            event: {
              id: event.id,
              title: event.title,
              description: event.description,
              location: event.location,
              date: event.date,
              price: event.price,
              image: event.image,
              capacity: event.capacity
            }
          };
        }
        return reservation;
      });
      
      res.json({ ok: true, reservations: enrichedReservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ error: 'Server error' });
    }
  })();
});

module.exports = router;
