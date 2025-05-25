const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Starting TourGid Minimal Server...');
console.log('PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    port: PORT,
    message: 'TourGid Backend Healthy'
  });
});

// Root
app.get('/', (req, res) => {
  console.log('Root endpoint requested');
  res.json({
    message: '🚀 TourGid AI Backend Running!',
    status: 'active',
    endpoints: ['/health', '/attractions', '/ai/process-voice'],
    timestamp: new Date().toISOString()
  });
});

// Attractions data (simplified)
const ATTRACTIONS = [
  {
    id: 'ast001',
    name: 'Байтерек',
    description: 'Символ Астаны - башня высотой 97 метров',
    coordinates: { latitude: 51.1283, longitude: 71.4306 },
    rating: 4.8
  },
  {
    id: 'pvl001', 
    name: 'Мечеть Машхур Жусупа',
    description: 'Главная мечеть Павлодара',
    coordinates: { latitude: 52.2970, longitude: 76.9470 },
    rating: 4.6
  }
];

// Attractions endpoint
app.get('/attractions', (req, res) => {
  console.log('Attractions requested');
  res.json({
    success: true,
    data: ATTRACTIONS,
    count: ATTRACTIONS.length
  });
});

// AI Voice processing (simplified)
app.post('/ai/process-voice', (req, res) => {
  console.log('Voice processing requested:', req.body);
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      error: 'Query required'
    });
  }

  // Simple response
  const response = {
    success: true,
    data: {
      intent: 'find_attraction',
      confidence: 0.8,
      response_text: `Я получил ваш запрос: "${query}". Показываю достопримечательности Казахстана.`,
      destination: ATTRACTIONS[0]
    }
  };

  res.json(response);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});

// 404
app.use((req, res) => {
  console.log('404:', req.url);
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log('✅ Bound to 0.0.0.0');
  console.log('✅ Ready for requests');
});

console.log('Server setup complete'); 