const http = require('http');

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 4000, path, agent: false }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    }).on('error', e => reject(e));
  });
}

(async () => {
  try {
    console.log('SMOKETEST: GET /api/health');
    const h = await get('/api/health');
    console.log('=>', h.status, h.body);

    console.log('SMOKETEST: GET /api/events');
    const ev = await get('/api/events');
    console.log('=>', ev.status, ev.body);

    console.log('SMOKETEST: done');
  } catch (e) {
    console.error('SMOKETEST ERROR', e && e.message ? e.message : e);
    process.exit(2);
  }
})();
