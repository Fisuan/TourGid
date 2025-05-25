const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

console.log('🚀 Ultra Minimal TourGid Server Starting...');
console.log('PORT:', PORT);

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${new Date().toISOString()} - ${req.method} ${path}`);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (path === '/health') {
    const response = {
      status: 'OK',
      message: 'Ultra Minimal TourGid Server',
      timestamp: new Date().toISOString(),
      port: PORT
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }
  
  if (path === '/') {
    const response = {
      message: '🚀 Ultra Minimal TourGid Server Running!',
      status: 'active',
      timestamp: new Date().toISOString()
    };
    res.writeHead(200);
    res.end(JSON.stringify(response));
    return;
  }
  
  if (path === '/ai/process-voice' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const response = {
          success: true,
          data: {
            intent: 'find_attraction',
            response_text: `Получен запрос: "${data.query || 'пустой'}". Сервер работает!`,
            destination: {
              id: 'ast001',
              name: 'Байтерек',
              coordinates: { latitude: 51.1283, longitude: 71.4306 }
            }
          }
        };
        res.writeHead(200);
        res.end(JSON.stringify(response));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Ultra Minimal Server running on port ${PORT}`);
  console.log('✅ No external dependencies');
  console.log('✅ Ready for Railway');
});

console.log('Server setup complete'); 