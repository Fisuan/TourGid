import { StyleSheet } from 'react-native';

// Универсальный placeholder для изображений
const placeholderImage = require('../assets/placeholder.js');

// Регионы Казахстана
export const REGIONS = [
  {
    id: 'astana',
    name: 'Астана (Нур-Султан)',
    nameEn: 'Astana (Nur-Sultan)', 
    nameKz: 'Астана (Нұр-Сұлтан)',
    coordinates: { latitude: 51.1694, longitude: 71.4491 },
    description: 'Столица Казахстана, современный город с футуристической архитектурой',
    population: '1,350,000',
    founded: '1998 (как столица)'
  },
  {
    id: 'almaty',
    name: 'Алматы',
    nameEn: 'Almaty',
    nameKz: 'Алматы', 
    coordinates: { latitude: 43.2775, longitude: 76.8958 },
    description: 'Южная столица Казахстана, культурный и экономический центр',
    population: '2,000,000',
    founded: '1854'
  },
  {
    id: 'shymkent',
    name: 'Шымкент',
    nameEn: 'Shymkent',
    nameKz: 'Шымкент',
    coordinates: { latitude: 42.3417, longitude: 69.5901 },
    description: 'Древний город на Великом Шелковом пути',
    population: '1,000,000',
    founded: 'XII век'
  },
  {
    id: 'karaganda',
    name: 'Караганда',
    nameEn: 'Karaganda', 
    nameKz: 'Қарағанды',
    coordinates: { latitude: 49.8047, longitude: 73.1094 },
    description: 'Промышленный центр Центрального Казахстана',
    population: '500,000',
    founded: '1934'
  },
  {
    id: 'aktobe',
    name: 'Актобе',
    nameEn: 'Aktobe',
    nameKz: 'Ақтөбе',
    coordinates: { latitude: 50.2839, longitude: 57.1670 },
    description: 'Западный промышленный центр',
    population: '500,000', 
    founded: '1869'
  }
];

// Достопримечательности по регионам
export const ATTRACTIONS = [
  // АСТАНА (НУР-СУЛТАН) - 18 мест
  {
    id: 'ast001',
    name: 'Байтерек',
    description: 'Символ Астаны, 97-метровая башня с обзорной площадкой',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['architecture', 'culture', 'scenic'],
    workingHours: { weekdays: '09:00 - 21:00', weekend: '09:00 - 21:00', dayOff: null },
    contacts: { phone: '+7 (7172) 74-20-66', address: 'пр. Нурсултан Назарбаев, 1' },
    coordinates: { latitude: 51.1215, longitude: 71.4394 }
  },
  {
    id: 'ast002', 
    name: 'Хан Шатыр',
    description: 'Уникальный торгово-развлекательный центр в виде шатра',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['shopping', 'entertainment', 'architecture'],
    workingHours: { weekdays: '10:00 - 22:00', weekend: '10:00 - 22:00', dayOff: null },
    coordinates: { latitude: 51.1327, longitude: 71.4040 }
  },
  {
    id: 'ast003',
    name: 'Мечеть Нур-Астана',
    description: 'Главная мечеть столицы, одна из крупнейших в Центральной Азии',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['religion', 'architecture', 'culture'],
    workingHours: { weekdays: '05:00 - 23:00', weekend: '05:00 - 23:00', dayOff: null },
    coordinates: { latitude: 51.1282, longitude: 71.4306 }
  },
  {
    id: 'ast004',
    name: 'Дворец Мира и Согласия',
    description: 'Пирамидальное здание для межрелигиозных конгрессов',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['architecture', 'culture', 'politics'],
    coordinates: { latitude: 51.1050, longitude: 71.4086 }
  },
  {
    id: 'ast005',
    name: 'Национальный музей Казахстана',
    description: 'Крупнейший музей страны с богатой коллекцией',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['history', 'culture', 'education'],
    workingHours: { weekdays: '10:00 - 19:00', weekend: '10:00 - 19:00', dayOff: 'Понедельник' },
    coordinates: { latitude: 51.1280, longitude: 71.4687 }
  },
  {
    id: 'ast006',
    name: 'Акорда',
    description: 'Резиденция Президента Казахстана',
    location: 'г. Астана',
    regionId: 'astana', 
    image: placeholderImage,
    categories: ['politics', 'architecture'],
    coordinates: { latitude: 51.1367, longitude: 71.4125 }
  },
  {
    id: 'ast007',
    name: 'Астана Опера',
    description: 'Национальный театр оперы и балета',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['culture', 'music', 'architecture'],
    coordinates: { latitude: 51.1500, longitude: 71.4200 }
  },
  {
    id: 'ast008',
    name: 'Набережная реки Есил',
    description: 'Современная набережная с парками и развлечениями',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['nature', 'recreation', 'scenic'],
    coordinates: { latitude: 51.1400, longitude: 71.4600 }
  },
  {
    id: 'ast009',
    name: 'Казахстан Темир Жолы',
    description: 'Современный железнодорожный вокзал',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['architecture', 'transport'],
    coordinates: { latitude: 51.0200, longitude: 71.3800 }
  },
  {
    id: 'ast010',
    name: 'Мечеть Хазрет Султан',
    description: 'Вторая по величине мечеть в Центральной Азии',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['religion', 'architecture'],
    coordinates: { latitude: 51.0900, longitude: 71.4100 }
  },
  {
    id: 'ast011',
    name: 'Дворец Независимости',
    description: 'Выставочный центр и музей истории независимости',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['history', 'politics', 'culture'],
    coordinates: { latitude: 51.1100, longitude: 71.4000 }
  },
  {
    id: 'ast012',
    name: 'Парк Победы',
    description: 'Мемориальный парк в честь победы в ВОВ',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['history', 'nature', 'memorial'],
    coordinates: { latitude: 51.1600, longitude: 71.4300 }
  },
  {
    id: 'ast013',
    name: 'Astana Arena',
    description: 'Национальный стадион Казахстана',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['sport', 'architecture'],
    coordinates: { latitude: 51.0950, longitude: 71.4150 }
  },
  {
    id: 'ast014',
    name: 'Oceanarium Duman',
    description: 'Крупнейший океанариум в Центральной Азии',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['entertainment', 'family', 'education'],
    workingHours: { weekdays: '10:00 - 22:00', weekend: '10:00 - 22:00', dayOff: null },
    coordinates: { latitude: 51.1380, longitude: 71.4020 }
  },
  {
    id: 'ast015',
    name: 'Центральный парк',
    description: 'Главный городской парк отдыха',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['nature', 'recreation', 'family'],
    coordinates: { latitude: 51.1250, longitude: 71.4350 }
  },
  {
    id: 'ast016',
    name: 'Монумент Казак Ели',
    description: '91-метровый монумент независимости Казахстана',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['history', 'architecture', 'politics'],
    coordinates: { latitude: 51.1180, longitude: 71.4420 }
  },
  {
    id: 'ast017',
    name: 'Мост Атырау',
    description: 'Современный мост через реку Есил',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['architecture', 'scenic'],
    coordinates: { latitude: 51.1320, longitude: 71.4780 }
  },
  {
    id: 'ast018',
    name: 'Триумфальная арка Мангилик Ел',
    description: 'Символ вечной страны Мангилик Ел',
    location: 'г. Астана',
    regionId: 'astana',
    image: placeholderImage,
    categories: ['architecture', 'politics', 'culture'],
    coordinates: { latitude: 51.1550, longitude: 71.4100 }
  },

  // АЛМАТЫ - 20 мест
  {
    id: 'alm001',
    name: 'Медеу',
    description: 'Высокогорный каток, спортивный комплекс мирового уровня',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['sport', 'nature', 'scenic'],
    coordinates: { latitude: 43.1639, longitude: 77.0789 }
  },
  {
    id: 'alm002',
    name: 'Шымбулак',
    description: 'Горнолыжный курорт в Заилийском Алатау',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['sport', 'nature', 'adventure'],
    coordinates: { latitude: 43.1506, longitude: 77.0839 }
  },
  {
    id: 'alm003',
    name: 'Парк Первого Президента',
    description: 'Центральный парк города с аллеями и фонтанами',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'recreation', 'politics'],
    coordinates: { latitude: 43.2380, longitude: 76.9450 }
  },
  {
    id: 'alm004',
    name: 'Кок-Тобе',
    description: 'Городская гора с парком развлечений и канатной дорогой',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['entertainment', 'scenic', 'family'],
    coordinates: { latitude: 43.2394, longitude: 76.9130 }
  },
  {
    id: 'alm005',
    name: 'Центральная мечеть',
    description: 'Главная соборная мечеть Алматы',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['religion', 'architecture'],
    coordinates: { latitude: 43.2501, longitude: 76.9286 }
  },
  {
    id: 'alm006',
    name: 'Алматинский зоопарк',
    description: 'Старейший зоопарк Казахстана',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['family', 'education', 'nature'],
    workingHours: { weekdays: '09:00 - 19:00', weekend: '09:00 - 20:00', dayOff: null },
    coordinates: { latitude: 43.2301, longitude: 76.9089 }
  },
  {
    id: 'alm007',
    name: 'Арбат (улица Жибек Жолы)',
    description: 'Пешеходная улица с магазинами и кафе',
    location: 'г. Алматы', 
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['shopping', 'culture', 'recreation'],
    coordinates: { latitude: 43.2567, longitude: 76.9286 }
  },
  {
    id: 'alm008',
    name: 'Большое Алматинское озеро',
    description: 'Горное озеро в ущелье Большая Алматинка',
    location: 'Алматинская область',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'scenic', 'adventure'],
    coordinates: { latitude: 43.0561, longitude: 76.9894 }
  },
  {
    id: 'alm009',
    name: 'Музей музыкальных инструментов',
    description: 'Уникальная коллекция казахских народных инструментов',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['music', 'culture', 'education'],
    coordinates: { latitude: 43.2478, longitude: 76.9178 }
  },
  {
    id: 'alm010',
    name: 'Вознесенский собор',
    description: 'Православный кафедральный собор XIX века',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['religion', 'architecture', 'history'],
    coordinates: { latitude: 43.2589, longitude: 76.9239 }
  },
  {
    id: 'alm011',
    name: 'Казахский театр оперы и балета имени Абая',
    description: 'Главный театр Алматы',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['culture', 'music', 'architecture'],
    coordinates: { latitude: 43.2533, longitude: 76.9339 }
  },
  {
    id: 'alm012',
    name: 'Центральный стадион',
    description: 'Главная спортивная арена Алматы',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['sport', 'architecture'],
    coordinates: { latitude: 43.2389, longitude: 76.8969 }
  },
  {
    id: 'alm013',
    name: 'Ботанический сад',
    description: 'Главный ботанический сад Казахстана',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'education', 'recreation'],
    coordinates: { latitude: 43.2178, longitude: 76.8939 }
  },
  {
    id: 'alm014',
    name: 'Рынок Зеленый базар',
    description: 'Крупнейший продуктовый рынок города',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['shopping', 'culture', 'food'],
    coordinates: { latitude: 43.2522, longitude: 76.9169 }
  },
  {
    id: 'alm015',
    name: 'Музей истории Алматы',
    description: 'История и культура южной столицы',
    location: 'г. Алматы',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['history', 'culture', 'education'],
    coordinates: { latitude: 43.2600, longitude: 76.9300 }
  },
  {
    id: 'alm016',
    name: 'Ущелье Кольсай',
    description: 'Система озер в Кольсайском национальном парке',
    location: 'Алматинская область',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'adventure', 'scenic'],
    coordinates: { latitude: 42.9667, longitude: 78.3333 }
  },
  {
    id: 'alm017',
    name: 'Чарынский каньон',
    description: 'Уникальный природный памятник, "младший брат" Гранд-Каньона',
    location: 'Алматинская область',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'scenic', 'adventure'],
    coordinates: { latitude: 43.3500, longitude: 79.0833 }
  },
  {
    id: 'alm018',
    name: 'Поющий бархан',
    description: 'Уникальный песчаный бархан в Алтын-Эмельском парке',
    location: 'Алматинская область',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'adventure', 'unique'],
    coordinates: { latitude: 44.4333, longitude: 78.5667 }
  },
  {
    id: 'alm019',
    name: 'Петроглифы Тамгалы',
    description: 'Древние наскальные рисунки под охраной ЮНЕСКО',
    location: 'Алматинская область',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['history', 'archaeology', 'unesco'],
    coordinates: { latitude: 43.7981, longitude: 75.5172 }
  },
  {
    id: 'alm020',
    name: 'Турген',
    description: 'Ущелье с водопадами и горячими источниками',
    location: 'Алматинская область',
    regionId: 'almaty',
    image: placeholderImage,
    categories: ['nature', 'wellness', 'adventure'],
    coordinates: { latitude: 43.1833, longitude: 77.6167 }
  },

  // ШЫМКЕНТ - 15 мест
  {
    id: 'shm001',
    name: 'Древний Отрар',
    description: 'Археологический комплекс древнего города на Шелковом пути',
    location: 'Туркестанская область',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['history', 'archaeology', 'unesco'],
    coordinates: { latitude: 42.5833, longitude: 68.3167 }
  },
  {
    id: 'shm002',
    name: 'Мавзолей Ходжи Ахмеда Ясави',
    description: 'Шедевр тимуридской архитектуры в Туркестане',
    location: 'г. Туркестан',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['religion', 'architecture', 'unesco'],
    coordinates: { latitude: 43.2967, longitude: 68.2550 }
  },
  {
    id: 'shm003',
    name: 'Парк имени Первого Президента',
    description: 'Центральный парк Шымкента',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['nature', 'recreation'],
    coordinates: { latitude: 42.3150, longitude: 69.5900 }
  },
  {
    id: 'shm004',
    name: 'Этно-мемориальный комплекс Алтын-Орда',
    description: 'Исторический комплекс времен Золотой Орды',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['history', 'culture'],
    coordinates: { latitude: 42.3200, longitude: 69.6000 }
  },
  {
    id: 'shm005',
    name: 'Дендропарк',
    description: 'Ботанический сад с редкими видами растений',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['nature', 'education', 'recreation'],
    coordinates: { latitude: 42.3100, longitude: 69.5950 }
  },
  {
    id: 'shm006',
    name: 'Плато Мангыстау',
    description: 'Уникальные меловые образования и древние некрополи',
    location: 'Мангистауская область',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['nature', 'adventure', 'history'],
    coordinates: { latitude: 43.6667, longitude: 51.1667 }
  },
  {
    id: 'shm007',
    name: 'Каратау',
    description: 'Горный хребет с петроглифами',
    location: 'Туркестанская область',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['nature', 'history', 'adventure'],
    coordinates: { latitude: 43.2000, longitude: 68.5000 }
  },
  {
    id: 'shm008',
    name: 'Достык плаза',
    description: 'Современный торгово-развлекательный центр',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['shopping', 'entertainment'],
    coordinates: { latitude: 42.3250, longitude: 69.5850 }
  },
  {
    id: 'shm009',
    name: 'Музей жертв политических репрессий',
    description: 'Мемориальный комплекс памяти репрессированных',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['history', 'memorial'],
    coordinates: { latitude: 42.3180, longitude: 69.5920 }
  },
  {
    id: 'shm010',
    name: 'Аквапарк Aqva',
    description: 'Современный аквапарк с аттракционами',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['entertainment', 'family', 'sport'],
    coordinates: { latitude: 42.3300, longitude: 69.5800 }
  },
  {
    id: 'shm011',
    name: 'Театр драмы имени Дулати',
    description: 'Областной казахский драматический театр',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['culture', 'entertainment'],
    coordinates: { latitude: 42.3170, longitude: 69.5890 }
  },
  {
    id: 'shm012',
    name: 'Фонтан Аманат',
    description: 'Символ дружбы народов Казахстана',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['culture', 'architecture'],
    coordinates: { latitude: 42.3160, longitude: 69.5880 }
  },
  {
    id: 'shm013',
    name: 'Старый город',
    description: 'Исторический центр с традиционной архитектурой',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['history', 'culture', 'architecture'],
    coordinates: { latitude: 42.3120, longitude: 69.5840 }
  },
  {
    id: 'shm014',
    name: 'Центральный рынок',
    description: 'Крупнейший рынок южного Казахстана',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['shopping', 'culture'],
    coordinates: { latitude: 42.3140, longitude: 69.5860 }
  },
  {
    id: 'shm015',
    name: 'Областной краеведческий музей',
    description: 'История и этнография Южно-Казахстанской области',
    location: 'г. Шымкент',
    regionId: 'shymkent',
    image: placeholderImage,
    categories: ['history', 'culture', 'education'],
    coordinates: { latitude: 42.3190, longitude: 69.5910 }
  },

  // КАРАГАНДА - 15 мест
  {
    id: 'kar001',
    name: 'КарЛаг музей',
    description: 'Музей истории Карагандинского лагеря',
    location: 'п. Долинка',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['history', 'memorial'],
    coordinates: { latitude: 47.2167, longitude: 73.1167 }
  },
  {
    id: 'kar002',
    name: 'Центральный парк культуры и отдыха',
    description: 'Главный парк Караганды',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['recreation', 'family'],
    coordinates: { latitude: 49.8047, longitude: 73.1094 }
  },
  {
    id: 'kar003',
    name: 'Ботанический сад КарГУ',
    description: 'Ботанический сад Карагандинского университета',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['nature', 'education'],
    coordinates: { latitude: 49.8100, longitude: 73.1150 }
  },
  {
    id: 'kar004',
    name: 'Дворец культуры горняков',
    description: 'Культурный центр города',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['culture', 'entertainment'],
    coordinates: { latitude: 49.8020, longitude: 73.1080 }
  },
  {
    id: 'kar005',
    name: 'Областной краеведческий музей',
    description: 'История Карагандинской области',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['history', 'culture'],
    coordinates: { latitude: 49.8030, longitude: 73.1070 }
  },
  {
    id: 'kar006',
    name: 'Мечеть Нуржан',
    description: 'Центральная мечеть Караганды',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['religion', 'architecture'],
    coordinates: { latitude: 49.8060, longitude: 73.1120 }
  },
  {
    id: 'kar007',
    name: 'Театр имени Станиславского',
    description: 'Областной драматический театр',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['culture', 'entertainment'],
    coordinates: { latitude: 49.8000, longitude: 73.1060 }
  },
  {
    id: 'kar008',
    name: 'Монумент в честь шахтеров',
    description: 'Памятник труженикам угольной промышленности',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['memorial', 'history'],
    coordinates: { latitude: 49.8080, longitude: 73.1100 }
  },
  {
    id: 'kar009',
    name: 'Спортивный комплекс Жастар',
    description: 'Современный спортивный центр',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['sport', 'recreation'],
    coordinates: { latitude: 49.8040, longitude: 73.1110 }
  },
  {
    id: 'kar010',
    name: 'Кафедральный собор Святого Иосифа',
    description: 'Католический собор',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['religion', 'architecture'],
    coordinates: { latitude: 49.8010, longitude: 73.1050 }
  },
  {
    id: 'kar011',
    name: 'Зоопарк',
    description: 'Карагандинский зоопарк',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['family', 'nature'],
    coordinates: { latitude: 49.8090, longitude: 73.1130 }
  },
  {
    id: 'kar012',
    name: 'Дворец спорта',
    description: 'Ледовый дворец спорта',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['sport', 'entertainment'],
    coordinates: { latitude: 49.8070, longitude: 73.1090 }
  },
  {
    id: 'kar013',
    name: 'Аквапарк Коктем',
    description: 'Крытый аквапарк',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['entertainment', 'family'],
    coordinates: { latitude: 49.8050, longitude: 73.1140 }
  },
  {
    id: 'kar014',
    name: 'Музей истории медицины',
    description: 'Уникальный музей медицинской истории',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['education', 'history'],
    coordinates: { latitude: 49.8035, longitude: 73.1075 }
  },
  {
    id: 'kar015',
    name: 'Центральная мечеть',
    description: 'Главная соборная мечеть',
    location: 'г. Караганда',
    regionId: 'karaganda',
    image: placeholderImage,
    categories: ['religion', 'architecture'],
    coordinates: { latitude: 49.8055, longitude: 73.1105 }
  },

  // АКТОБЕ - 15 мест
  {
    id: 'akt001',
    name: 'Областной драматический театр',
    description: 'Казахский драматический театр имени Онгарсынова',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['culture', 'entertainment'],
    coordinates: { latitude: 50.2839, longitude: 57.1670 }
  },
  {
    id: 'akt002',
    name: 'Парк 20 лет Независимости',
    description: 'Центральный парк города',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['recreation', 'nature'],
    coordinates: { latitude: 50.2850, longitude: 57.1680 }
  },
  {
    id: 'akt003',
    name: 'Областной краеведческий музей',
    description: 'История и культура Актюбинской области',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['history', 'culture'],
    coordinates: { latitude: 50.2830, longitude: 57.1650 }
  },
  {
    id: 'akt004',
    name: 'Центральная мечеть',
    description: 'Соборная мечеть Актобе',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['religion', 'architecture'],
    coordinates: { latitude: 50.2860, longitude: 57.1690 }
  },
  {
    id: 'akt005',
    name: 'Дом-музей Алии Молдагуловой',
    description: 'Музей героини Великой Отечественной войны',
    location: 'с. Булак',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['history', 'memorial'],
    coordinates: { latitude: 50.5333, longitude: 58.5000 }
  },
  {
    id: 'akt006',
    name: 'Памятник Курмангазы',
    description: 'Монумент великому композитору',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['culture', 'memorial'],
    coordinates: { latitude: 50.2840, longitude: 57.1660 }
  },
  {
    id: 'akt007',
    name: 'Дворец спорта Жастар',
    description: 'Спортивный комплекс',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['sport', 'recreation'],
    coordinates: { latitude: 50.2870, longitude: 57.1700 }
  },
  {
    id: 'akt008',
    name: 'Музей боевой славы',
    description: 'Военно-исторический музей',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['history', 'memorial'],
    coordinates: { latitude: 50.2820, longitude: 57.1640 }
  },
  {
    id: 'akt009',
    name: 'Центральный рынок',
    description: 'Главный торговый рынок',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['shopping', 'culture'],
    coordinates: { latitude: 50.2845, longitude: 57.1665 }
  },
  {
    id: 'akt010',
    name: 'Аквапарк Waterfun',
    description: 'Развлекательный аквапарк',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['entertainment', 'family'],
    coordinates: { latitude: 50.2880, longitude: 57.1710 }
  },
  {
    id: 'akt011',
    name: 'Центральная библиотека',
    description: 'Областная универсальная библиотека',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['education', 'culture'],
    coordinates: { latitude: 50.2835, longitude: 57.1655 }
  },
  {
    id: 'akt012',
    name: 'Стадион Центральный',
    description: 'Главный стадион города',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['sport'],
    coordinates: { latitude: 50.2865, longitude: 57.1685 }
  },
  {
    id: 'akt013',
    name: 'Мавзолей Кобланды батыра',
    description: 'Мавзолей легендарного героя',
    location: 'Актюбинская область',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['history', 'culture'],
    coordinates: { latitude: 49.8333, longitude: 58.1667 }
  },
  {
    id: 'akt014',
    name: 'Дом культуры',
    description: 'Областной дом культуры',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['culture', 'entertainment'],
    coordinates: { latitude: 50.2855, longitude: 57.1675 }
  },
  {
    id: 'akt015',
    name: 'Этнографический музей',
    description: 'Музей народного творчества',
    location: 'г. Актобе',
    regionId: 'aktobe',
    image: placeholderImage,
    categories: ['culture', 'history'],
    coordinates: { latitude: 50.2825, longitude: 57.1645 }
  }
];

// Интересы остаются прежними но расширим
export const INTERESTS = [
  { id: 'architecture', name: 'Архитектура', icon: 'business' },
  { id: 'history', name: 'История', icon: 'book' },
  { id: 'culture', name: 'Культура', icon: 'color-palette' },
  { id: 'nature', name: 'Природа', icon: 'leaf' },
  { id: 'religion', name: 'Религия', icon: 'moon' },
  { id: 'sport', name: 'Спорт', icon: 'fitness' },
  { id: 'entertainment', name: 'Развлечения', icon: 'game-controller' },
  { id: 'shopping', name: 'Шопинг', icon: 'bag' },
  { id: 'family', name: 'Семейный отдых', icon: 'people' },
  { id: 'education', name: 'Образование', icon: 'school' },
  { id: 'scenic', name: 'Живописные места', icon: 'camera' },
  { id: 'adventure', name: 'Приключения', icon: 'trail-sign' },
  { id: 'memorial', name: 'Мемориалы', icon: 'heart' },
  { id: 'politics', name: 'Политика', icon: 'library' },
  { id: 'music', name: 'Музыка', icon: 'musical-notes' }
];

// Маршруты теперь привязаны к регионам
export const ROUTES = [
  // Астана маршруты
  {
    id: 'ast_route_1',
    name: 'Символы столицы',
    description: 'Главные достопримечательности современной Астаны',
    duration: '1 день',
    difficulty: 'Лёгкий',
    regionId: 'astana',
    attractions: ['ast001', 'ast002', 'ast003', 'ast006'], // Байтерек, Хан Шатыр, Мечеть, Акорда
    recommendedTransport: 'Автобус/Такси',
    tips: [
      'Начните с Байтерека утром',
      'Закажите экскурсию в Акорду заранее',
      'В Хан Шатыре можно пообедать'
    ]
  },
  {
    id: 'ast_route_2', 
    name: 'Культурное наследие',
    description: 'Музеи и театры столицы',
    duration: '2 дня',
    difficulty: 'Средний',
    regionId: 'astana',
    attractions: ['ast005', 'ast007', 'ast011'], // Музей, Опера, Дворец Независимости
    recommendedTransport: 'Пешком/Такси',
    tips: [
      'Проверьте расписание спектаклей',
      'Музеи работают до 19:00',
      'Возьмите удобную обувь'
    ]
  },

  // Алматы маршруты
  {
    id: 'alm_route_1',
    name: 'Горы и природа',
    description: 'Медеу, Шымбулак и горные красоты',
    duration: '1 день',
    difficulty: 'Средний',
    regionId: 'almaty',
    attractions: ['alm001', 'alm002', 'alm008'], // Медеу, Шымбулак, БАО
    recommendedTransport: 'Автомобиль',
    tips: [
      'Возьмите теплую одежду',
      'Начните рано утром',
      'Проверьте работу канатной дороги'
    ]
  },
  {
    id: 'alm_route_2',
    name: 'Центр Алматы',
    description: 'Исторический центр и культурные объекты',
    duration: '1 день', 
    difficulty: 'Лёгкий',
    regionId: 'almaty',
    attractions: ['alm003', 'alm004', 'alm007', 'alm010'], // Парк, Кок-Тобе, Арбат, Собор
    recommendedTransport: 'Пешком/Метро',
    tips: [
      'Удобная обувь для прогулок',
      'Посетите Кок-Тобе на закате',
      'На Арбате много кафе'
    ]
  }
];

// Стили остаются прежними
const historicalTheme = {
  colors: {
    primary: '#8B4513',
    secondary: '#DAA520', 
    background: '#FFF8DC',
    text: '#463E3F',
    accent: '#800000'
  }
};

const typography = {
  headings: {
    fontFamily: 'Playfair Display',
    fontSize: { h1: 32, h2: 24, h3: 20 }
  },
  body: {
    fontFamily: 'Lora',
    fontSize: 16,
    lineHeight: 24
  }
};

const historicalStyles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B4513',
    backgroundColor: '#FFF8DC',
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  oldPaper: {
    backgroundColor: '#FFF8DC',
    borderRadius: 0,
    borderWidth: 2,
    borderColor: '#8B4513',
    padding: 20,
    margin: 10
  }
}); 