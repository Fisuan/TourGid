const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Упрощенная настройка CORS

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Логирование всех запросов для диагностики
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('Request body:', req.body);
  }
  next();
});

// Добавляем favicon чтобы избежать ошибок 502
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Возвращаем пустой ответ для favicon
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'TourGid Backend is healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    version: '1.0.0'
  });
});

// Павлодарские достопримечательности (синхронизация с фронтендом)
const ATTRACTIONS = [
  // АСТАНА
  {
    id: 'ast001',
    name: 'Байтерек',
    description: 'Символ Астаны - башня высотой 97 метров с обзорной площадкой',
    location: 'Проспект Нурсултан Назарбаев',
    coordinates: { latitude: 51.1283, longitude: 71.4306 },
    categories: ['architecture', 'scenic', 'unique'],
    rating: 4.8,
    popularity_score: 0.95,
    working_hours: { weekdays: '10:00 - 22:00', weekend: '10:00 - 22:00', dayOff: null },
    contacts: { phone: '+7 (7172) 44-66-44', address: 'Проспект Нурсултан Назарбаев', website: 'www.baiterek.kz' },
    visit_duration: '45-60 минут'
  },
  {
    id: 'ast002',
    name: 'Хан Шатыр',
    description: 'Крупнейший в мире шатер - торгово-развлекательный центр',
    location: 'Проспект Туран, 37',
    coordinates: { latitude: 51.1326, longitude: 71.4064 },
    categories: ['architecture', 'entertainment', 'shopping', 'unique'],
    rating: 4.6,
    popularity_score: 0.90,
    working_hours: { weekdays: '10:00 - 22:00', weekend: '10:00 - 23:00', dayOff: null },
    contacts: { phone: '+7 (7172) 44-44-44', address: 'Проспект Туран, 37', website: 'www.khanshatyr.kz' },
    visit_duration: '2-4 часа'
  },
  {
    id: 'ast003',
    name: 'Мечеть Нур-Астана',
    description: 'Главная мечеть столицы, одна из крупнейших в Центральной Азии',
    location: 'Проспект Абая, 10',
    coordinates: { latitude: 51.1801, longitude: 71.4460 },
    categories: ['religion', 'architecture', 'culture'],
    rating: 4.7,
    popularity_score: 0.85,
    working_hours: { weekdays: '05:00 - 23:00', weekend: '05:00 - 23:00', dayOff: null },
    contacts: { phone: '+7 (7172) 32-32-32', address: 'Проспект Абая, 10' },
    visit_duration: '30-45 минут'
  },
  {
    id: 'ast004',
    name: 'Национальный музей Республики Казахстан',
    description: 'Крупнейший музей страны с уникальными экспозициями',
    location: 'Площадь Независимости, 54',
    coordinates: { latitude: 51.1278, longitude: 71.4691 },
    categories: ['culture', 'history', 'education'],
    rating: 4.5,
    popularity_score: 0.80,
    working_hours: { weekdays: '10:00 - 19:00', weekend: '10:00 - 20:00', dayOff: 'Понедельник' },
    contacts: { phone: '+7 (7172) 91-98-98', address: 'Площадь Независимости, 54', website: 'www.nationalmuseum.kz' },
    visit_duration: '2-4 часа'
  },

  // ПАВЛОДАР
  {
    id: 'pvl001',
    name: 'Мечеть Машхур Жусупа',
    description: 'Главная соборная мечеть Павлодара, построенная в честь великого казахского просветителя',
    location: 'ул. Академика Сатпаева, 30',
    coordinates: { latitude: 52.2970, longitude: 76.9470 },
    categories: ['religion', 'architecture', 'culture'],
    rating: 4.6,
    popularity_score: 0.9,
    working_hours: { weekdays: '05:00 - 23:00', weekend: '05:00 - 23:00', dayOff: null },
    contacts: { phone: '+7 (7182) 61-15-55', address: 'ул. Академика Сатпаева, 30' },
    visit_duration: '30-45 минут'
  },
  {
    id: 'pvl002',
    name: 'Благовещенский собор',
    description: 'Православный кафедральный собор - архитектурная жемчужина Павлодара',
    location: 'ул. Кутузова, 4',
    coordinates: { latitude: 52.2850, longitude: 76.9650 },
    categories: ['religion', 'architecture', 'history'],
    rating: 4.7,
    popularity_score: 0.85,
    working_hours: { weekdays: '07:00 - 19:00', weekend: '07:00 - 20:00', dayOff: null },
    contacts: { phone: '+7 (7182) 32-14-85', address: 'ул. Кутузова, 4', email: 'sobor.pavlodar@mail.ru' },
    visit_duration: '30-60 минут'
  },
  {
    id: 'pvl003',
    name: 'Набережная реки Иртыш',
    description: 'Главная прогулочная зона города с красивыми видами на реку',
    location: 'Набережная им. Габита Мусрепова',
    coordinates: { latitude: 52.2900, longitude: 76.9600 },
    categories: ['nature', 'recreation', 'scenic'],
    rating: 4.5,
    popularity_score: 0.95,
    working_hours: { weekdays: '24/7', weekend: '24/7', dayOff: null },
    contacts: { phone: '+7 (7182) 55-12-00', address: 'Набережная им. Габита Мусрепова' },
    visit_duration: '1-3 часа'
  },
  {
    id: 'pvl004',
    name: 'Дом-музей Павла Васильева',
    description: 'Мемориальный музей знаменитого поэта, уроженца Павлодара',
    location: 'ул. Павла Васильева, 78',
    coordinates: { latitude: 52.2820, longitude: 76.9580 },
    categories: ['culture', 'history', 'education'],
    rating: 4.4,
    popularity_score: 0.70,
    working_hours: { weekdays: '09:00 - 18:00', weekend: '10:00 - 17:00', dayOff: 'Понедельник' },
    contacts: { phone: '+7 (7182) 61-28-47', address: 'ул. Павла Васильева, 78', email: 'vasiliev.museum@mail.ru' },
    visit_duration: '45-90 минут'
  },
  {
    id: 'pvl005',
    name: 'Областной краеведческий музей',
    description: 'Главный музей региона с богатой коллекцией по истории и природе Прииртышья',
    location: 'ул. Академика Сатпаева, 40',
    coordinates: { latitude: 52.2890, longitude: 76.9420 },
    categories: ['history', 'culture', 'education'],
    rating: 4.3,
    popularity_score: 0.75,
    working_hours: { weekdays: '09:00 - 18:00', weekend: '10:00 - 17:00', dayOff: 'Понедельник' },
    contacts: { phone: '+7 (7182) 67-36-64', address: 'ул. Академика Сатпаева, 40', website: 'museum.pavlodar.gov.kz' },
    visit_duration: '1-2 часа'
  },
  {
    id: 'pvl009',
    name: 'Баянаульский национальный парк',
    description: 'Первый национальный парк Казахстана с уникальной природой',
    location: 'Баянаульский район, 100 км от Павлодара',
    coordinates: { latitude: 52.5000, longitude: 75.7000 },
    categories: ['nature', 'adventure', 'scenic'],
    rating: 4.9,
    popularity_score: 0.95,
    working_hours: { weekdays: '08:00 - 20:00', weekend: '08:00 - 20:00', dayOff: null },
    contacts: { phone: '+7 (71836) 2-13-58', address: 'с. Баянаул', website: 'bayanaul.kz' },
    visit_duration: '1-3 дня'
  }
];

// Простая NLU функция
function processUserQuery(query) {
  const lowerQuery = query.toLowerCase();
  
  // Определяем намерение
  let intent = 'general';
  if (lowerQuery.includes('маршрут') || lowerQuery.includes('как добраться') || lowerQuery.includes('дорога')) {
    intent = 'get_route';
  } else if (lowerQuery.includes('найти') || lowerQuery.includes('покажи') || lowerQuery.includes('где')) {
    intent = 'find_attraction';
  } else if (lowerQuery.includes('время') || lowerQuery.includes('работает') || lowerQuery.includes('открыт')) {
    intent = 'get_info';
  }

  // Ищем упоминания достопримечательностей
  let mentioned_attractions = [];
  ATTRACTIONS.forEach(attraction => {
    const nameWords = attraction.name.toLowerCase().split(' ');
    const hasMatch = nameWords.some(word => 
      lowerQuery.includes(word) && word.length > 3
    );
    if (hasMatch) {
      mentioned_attractions.push(attraction);
    }
  });

  // Если конкретных мест не найдено, предлагаем популярные
  if (mentioned_attractions.length === 0 && intent === 'get_route') {
    mentioned_attractions = ATTRACTIONS
      .sort((a, b) => b.popularity_score - a.popularity_score)
      .slice(0, 1);
  }

  return {
    intent,
    mentioned_attractions,
    confidence: mentioned_attractions.length > 0 ? 0.9 : 0.6
  };
}

// Генерация маршрута
function generateRoute(destination, preferences = []) {
  // Генерируем случайные путевые точки для демонстрации
  const waypoints = [];
  
  // Добавляем одну-две путевые точки если это популярное место
  if (destination.popularity_score > 0.8) {
    const nearbyAttractions = ATTRACTIONS.filter(a => 
      a.id !== destination.id && 
      Math.random() > 0.6
    ).slice(0, 2);
    
    waypoints.push(...nearbyAttractions.map(a => ({
      attractionId: a.id,
      name: a.name,
      coordinates: a.coordinates
    })));
  }

  const estimatedDistance = 8.5 + Math.random() * 10; // 8.5-18.5 км
  const estimatedDuration = 60 + Math.random() * 120; // 60-180 мин

  return {
    start: { latitude: 52.2900, longitude: 76.9500 }, // Центр Павлодара
    end: destination.coordinates,
    waypoints,
    estimated_distance: estimatedDistance,
    estimated_duration: estimatedDuration,
    difficulty_level: estimatedDistance > 15 ? 'medium' : 'easy',
    highlights: ['Исторический центр', 'Живописные виды'],
    warnings: []
  };
}

// API Routes

// Главная страница с информацией о API
app.get('/', (req, res) => {
  res.json({
    message: '🚀 TourGid AI Backend is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      ai_voice: '/ai/process-voice',
      attractions: '/attractions',
      routes: '/routes'
    },
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// Получить все достопримечательности
app.get('/attractions', (req, res) => {
  res.json({
    success: true,
    data: ATTRACTIONS,
    count: ATTRACTIONS.length
  });
});

// Обработка голосового запроса через Prompt Chaining
app.post('/ai/process-voice', (req, res) => {
  try {
    const { query, user_location } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    console.log(`🎤 Processing voice query: "${query}"`);

    // Шаг 1: NLU - понимание запроса
    const nluResult = processUserQuery(query);
    
    // Шаг 2: Генерация маршрута (если нужно)
    let routeData = null;
    if (nluResult.intent === 'get_route' && nluResult.mentioned_attractions.length > 0) {
      const destination = nluResult.mentioned_attractions[0];
      const route = generateRoute(destination);
      routeData = {
        destination: {
          id: destination.id,
          name: destination.name,
          coordinates: destination.coordinates,
          categories: destination.categories,
          rating: destination.rating,
          popularity_score: destination.popularity_score,
          opening_hours: destination.working_hours.weekdays,
          relevance_score: 13.4
        },
        route: route,
        reasoning: [`Добавлены ${route?.waypoints?.length || 1} интересные остановки по пути`]
      };
    }

    // Шаг 3: NLG - генерация ответа
    let response_text = '';
    if (nluResult.intent === 'get_route' && routeData) {
      const dest = routeData.destination;
      const route = routeData.route;
      response_text = `Отлично! Я нашел маршрут к ${dest.name}. Расстояние: ${route.estimated_distance.toFixed(1)} км. Примерное время в пути: ${Math.round(route.estimated_duration)} минут. Маршрут отображается на карте. Приятного путешествия!`;
    } else if (nluResult.mentioned_attractions.length > 0) {
      const attraction = nluResult.mentioned_attractions[0];
      response_text = `${attraction.name} - ${attraction.description}. Рейтинг: ${attraction.rating}/5. Находится по адресу: ${attraction.location}.`;
    } else {
      response_text = 'Извините, я не смог найти информацию по вашему запросу. Попробуйте спросить о конкретных достопримечательностях Павлодара.';
    }

    // Альтернативные варианты
    const alternatives = [];
    if (nluResult.intent === 'get_route') {
      alternatives.push({
        type: 'comprehensive',
        description: 'Подробный осмотр с дополнительными остановками',
        estimated_duration: (routeData?.route?.estimated_duration || 120) + 60
      });
    }

    const result = {
      success: true,
      data: {
        // NLU результат
        intent: nluResult.intent,
        confidence: nluResult.confidence,
        destination: routeData?.destination,
        fetchai_route: routeData?.route,
        preferences: [],
        reasoning: routeData?.reasoning || [],
        alternatives,
        
        // NLG результат
        response_text,
        
        // Полный маршрут если сгенерирован
        route_data: routeData
      }
    };

    console.log(`✅ Generated response: ${response_text}`);
    res.json(result);

  } catch (error) {
    console.error('Error processing voice query:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Генерация маршрута
app.post('/ai/generate-route', (req, res) => {
  try {
    const { destination_id, preferences = [], user_location } = req.body;

    const destination = ATTRACTIONS.find(a => a.id === destination_id);
    if (!destination) {
      return res.status(404).json({
        success: false,
        error: 'Destination not found'
      });
    }

    const route = generateRoute(destination, preferences);
    
    res.json({
      success: true,
      data: {
        destination,
        route,
        preferences
      }
    });

  } catch (error) {
    console.error('Error generating route:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 TourGid AI Backend running on port ${PORT}`);
  console.log(`📍 Serving ${ATTRACTIONS.length} attractions from Astana & Pavlodar`);
  console.log(`🤖 AI endpoints ready for voice processing`);
}); 