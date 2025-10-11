const http = require('http');
const https = require('https');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'localhost', port: 4000, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null }));
    });
    req.on('error', reject);
    req.write(data); req.end();
  });
}

(async ()=>{
  try{
    console.log('Registering test user...');
    let r = await postJson('/api/auth/register', { email: 'test@example.com', password: 'secret123', type: 'user' });
    console.log('register:', r.status, r.body);

    console.log('Logging in...');
    r = await postJson('/api/auth/login', { email: 'test@example.com', password: 'secret123' });
    console.log('login:', r.status, r.body);

    // attempt reservation
    console.log('Creating reservation (expect eventId null -> fail) ...');
    r = await postJson('/api/reservations', { eventId: 1, fullName: 'Tester', email: 'test@example.com' });
    console.log('reserve:', r.status, r.body);
  } catch (e) { console.error(e); }
})();
