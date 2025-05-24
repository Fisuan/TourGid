const https = require('https');

const BACKEND_URL = 'https://tourgid-production-8074.up.railway.app';

console.log('🧪 Testing TourGid Backend at:', BACKEND_URL);

https.get(BACKEND_URL + '/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('📡 Status:', res.statusCode, res.statusMessage);
    if (res.statusCode === 200) {
      console.log('✅ Backend is working!');
      console.log('📄 Response:', JSON.parse(data));
    } else {
      console.error('❌ Backend error');
      console.log('Response:', data);
    }
  });
}).on('error', (err) => {
  console.error('💥 Connection error:', err.message);
}); 