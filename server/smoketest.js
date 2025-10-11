const http = require('http');

http.get('http://localhost:4000/api/health', res => {
  let data='';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('health response:', data));
}).on('error', e=> console.error(e));
