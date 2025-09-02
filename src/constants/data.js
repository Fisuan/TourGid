import { StyleSheet } from 'react-native';

// Регионы - только Астана и Павлодар
export const REGIONS = [
  {
    id: 'astana',
    name: 'Астана',
    nameEn: 'Astana',
    nameKz: 'Астана',
    coordinates: { latitude: 51.1694, longitude: 71.4491 },
    description: 'Столица Казахстана с современной архитектурой и культурными достопримечательностями',
    population: '1,350,000',
    founded: '1830 (как Акмолинск)',
    climate: 'Резко континентальный',
    mainCity: 'Астана',
    attractions_count: 8
  },
  {
    id: 'pavlodar',
    name: 'Павлодарская область',
    nameEn: 'Pavlodar Region',
    nameKz: 'Павлодар облысы',
    coordinates: { latitude: 52.3000, longitude: 76.9500 },
    description: 'Промышленный и культурный центр Северного Казахстана на берегу Иртыша',
    population: '750,000',
    founded: '1720 (как форпост Коряковский)',
    climate: 'Резко континентальный',
    mainCity: 'Павлодар',
    attractions_count: 12
  }
];

// Достопримечательности Астаны
export const ATTRACTIONS = [
  // АСТАНА
  {
    id: 'ast001',
    name: 'Байтерек',
    description: 'Символ Астаны - башня высотой 97 метров с обзорной площадкой',
    location: 'Проспект Нурсултан Назарбаев',
    regionId: 'astana',
    image: require('../assets/astana/baiterek.jpg'),
    categories: ['architecture', 'scenic', 'unique'],
    workingHours: { 
      weekdays: '10:00 - 22:00', 
      weekend: '10:00 - 22:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7172) 44-66-44', 
      address: 'Проспект Нурсултан Назарбаев',
      website: 'www.baiterek.kz'
    },
    coordinates: { latitude: 51.1283, longitude: 71.4306 },
    historicalInfo: 'Башня Байтерек построена в 2002 году как символ переноса столицы. Высота 97 метров символизирует 1997 год - год переноса столицы в Астану.',
    tips: [
      'Лучший вид на город с высоты 86 метров',
      'Приходите на закате для красивых фото',
      'Есть отпечаток руки Президента'
    ],
    rating: 4.8,
    visitDuration: '45-60 минут',
    bestTimeToVisit: 'Вечером на закате',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'ast002',
    name: 'Хан Шатыр',
    description: 'Крупнейший в мире шатер - торгово-развлекательный центр',
    location: 'Проспект Туран, 37',
    regionId: 'astana',
    image: require('../assets/astana/khan-shatyr.jpg'),
    categories: ['architecture', 'entertainment', 'shopping', 'unique'],
    workingHours: { 
      weekdays: '10:00 - 22:00', 
      weekend: '10:00 - 23:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7172) 44-44-44', 
      address: 'Проспект Туран, 37',
      website: 'www.khanshatyr.kz'
    },
    coordinates: { latitude: 51.1326, longitude: 71.4064 },
    historicalInfo: 'Открыт в 2010 году, спроектирован британским архитектором Норманом Фостером. Высота 150 метров, внутри поддерживается тропический климат.',
    tips: [
      'Внутри пляжный курорт с песком с Мальдив',
      'Монорельс до верхнего этажа',
      'Более 200 магазинов'
    ],
    rating: 4.6,
    visitDuration: '2-4 часа',
    bestTimeToVisit: 'В любое время года',
    accessibility: 'Полностью доступен'
  },
  {
    id: 'ast003',
    name: 'Мечеть Нур-Астана',
    description: 'Главная мечеть столицы, одна из крупнейших в Центральной Азии',
    location: 'Проспект Абая, 10',
    regionId: 'astana',
    image: require('../assets/astana/nur-astana-mosque.jpg'),
    categories: ['religion', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '05:00 - 23:00', 
      weekend: '05:00 - 23:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7172) 32-32-32', 
      address: 'Проспект Абая, 10'
    },
    coordinates: { latitude: 51.1801, longitude: 71.4460 },
    historicalInfo: 'Построена в 2005 году, может вместить 5000 верующих. Подарок эмира Катара.',
    tips: [
      'Соблюдайте дресс-код',
      'Экскурсии на казахском и русском языках',
      'Красивая архитектура в исламском стиле'
    ],
    rating: 4.7,
    visitDuration: '30-45 минут',
    bestTimeToVisit: 'После полуденной молитвы',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'ast004',
    name: 'Национальный музей Республики Казахстан',
    description: 'Крупнейший музей страны с уникальными экспозициями',
    location: 'Площадь Независимости, 54',
    regionId: 'astana',
    image: require('../assets/astana/national-museum-astana.jpg'),
    categories: ['culture', 'history', 'education'],
    workingHours: { 
      weekdays: '10:00 - 19:00', 
      weekend: '10:00 - 20:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7172) 91-98-98', 
      address: 'Площадь Независимости, 54',
      website: 'www.nationalmuseum.kz'
    },
    coordinates: { latitude: 51.1278, longitude: 71.4691 },
    historicalInfo: 'Открыт в 2014 году, самый большой музей Центральной Азии. Содержит экспонаты от древности до современности.',
    tips: [
      'Выделите целый день на посещение',
      'Золотой человек - главный экспонат',
      'Есть интерактивные залы'
    ],
    rating: 4.5,
    visitDuration: '2-4 часа',
    bestTimeToVisit: 'В выходные дни',
    accessibility: 'Полностью доступен'
  },
  
  // ПАВЛОДАР (оставляем существующие, но обновляем изображения)
  {
    id: 'pvl001',
    name: 'Мечеть Машхур Жусупа',
    description: 'Главная соборная мечеть Павлодара, построенная в честь великого казахского просветителя',
    location: 'ул. Академика Сатпаева, 30',
    regionId: 'pavlodar', 
    image: require('../assets/pavlodar/mashkhur-zhusup-mosque.jpg'),
    categories: ['religion', 'architecture', 'culture'],
    workingHours: { 
      weekdays: '05:00 - 23:00', 
      weekend: '05:00 - 23:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 61-15-55', 
      address: 'ул. Академика Сатпаева, 30'
    },
    coordinates: { latitude: 52.2970, longitude: 76.9470 },
    historicalInfo: 'Построена в 2001 году в честь Машхур Жусупа Копеева - выдающегося казахского ученого, просветителя и религиозного деятеля XIX века.',
    tips: [
      'Вход свободный для всех посетителей',
      'Соблюдайте дресс-код при посещении',
      'Фотографирование внутри требует разрешения'
    ],
    rating: 4.6,
    visitDuration: '30-45 минут',
    bestTimeToVisit: 'Утром или после вечерней молитвы',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'pvl002',
    name: 'Благовещенский собор',
    description: 'Православный кафедральный собор - архитектурная жемчужина Павлодара',
    location: 'ул. Кутузова, 4',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/blagoveshchensky-cathedral.jpg'),
    categories: ['religion', 'architecture', 'history'],
    workingHours: { 
      weekdays: '07:00 - 19:00', 
      weekend: '07:00 - 20:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 32-14-85', 
      address: 'ул. Кутузова, 4',
      email: 'sobor.pavlodar@mail.ru'
    },
    coordinates: { latitude: 52.2850, longitude: 76.9650 },
    historicalInfo: 'Построен в 1864 году как первый каменный храм Павлодара. Является памятником архитектуры XIX века.',
    tips: [
      'Красивые иконостасы и фрески внутри',
      'Можно приобрести церковную литературу',
      'По воскресеньям проходят торжественные службы'
    ],
    rating: 4.7,
    visitDuration: '30-60 минут',
    bestTimeToVisit: 'Утром в будний день',
    accessibility: 'Частично доступен'
  },
  {
    id: 'pvl003',
    name: 'Набережная реки Иртыш',
    description: 'Главная прогулочная зона города с красивыми видами на реку',
    location: 'Набережная им. Габита Мусрепова',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/irtysh-embankment.jpg'),
    categories: ['nature', 'recreation', 'scenic'],
    workingHours: { 
      weekdays: '24/7', 
      weekend: '24/7', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (7182) 55-12-00', 
      address: 'Набережная им. Габита Мусрепова'
    },
    coordinates: { latitude: 52.2900, longitude: 76.9600 },
    historicalInfo: 'Набережная благоустроена в 2000-х годах. Иртыш - одна из крупнейших рек Азии.',
    tips: [
      'Лучшие фото на закате',
      'Есть прокат велосипедов и лодок',
      'Множество кафе и ресторанов рядом'
    ],
    rating: 4.5,
    visitDuration: '1-3 часа',
    bestTimeToVisit: 'Вечером на закате',
    accessibility: 'Полностью доступна'
  },
  {
    id: 'pvl004',
    name: 'Дом-музей Павла Васильева',
    description: 'Мемориальный музей знаменитого поэта, уроженца Павлодара',
    location: 'ул. Павла Васильева, 78',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/vasiliev-house-museum.jpg'),
    categories: ['culture', 'history', 'education'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7182) 61-28-47', 
      address: 'ул. Павла Васильева, 78',
      email: 'vasiliev.museum@mail.ru'
    },
    coordinates: { latitude: 52.2820, longitude: 76.9580 },
    historicalInfo: 'Павел Васильев (1910-1937) - выдающийся русский поэт, родился в Зайсане, но детство провел в Павлодаре.',
    tips: [
      'Экскурсии проводятся каждый час',
      'Есть библиотека с произведениями поэта',
      'Регулярно проходят литературные вечера'
    ],
    rating: 4.4,
    visitDuration: '45-90 минут',
    bestTimeToVisit: 'В будний день утром',
    accessibility: 'Частично доступен'
  },
  {
    id: 'pvl005',
    name: 'Областной краеведческий музей',
    description: 'Главный музей региона с богатой коллекцией по истории и природе Прииртышья',
    location: 'ул. Академика Сатпаева, 40',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/pavlodar-museum.jpg'),
    categories: ['history', 'culture', 'education'],
    workingHours: { 
      weekdays: '09:00 - 18:00', 
      weekend: '10:00 - 17:00', 
      dayOff: 'Понедельник' 
    },
    contacts: { 
      phone: '+7 (7182) 67-36-64', 
      address: 'ул. Академика Сатпаева, 40',
      website: 'museum.pavlodar.gov.kz'
    },
    coordinates: { latitude: 52.2890, longitude: 76.9420 },
    historicalInfo: 'Основан в 1942 году. Хранит более 80 000 экспонатов.',
    tips: [
      'Особенно интересна археологическая коллекция',
      'Есть диорама "Освоение целины"',
      'Проводятся мастер-классы для детей'
    ],
    rating: 4.3,
    visitDuration: '1-2 часа',
    bestTimeToVisit: 'В выходные дни',
    accessibility: 'Доступен для людей с ограниченными возможностями'
  },
  {
    id: 'pvl009',
    name: 'Баянаульский национальный парк',
    description: 'Первый национальный парк Казахстана с уникальной природой',
    location: 'Баянаульский район, 100 км от Павлодара',
    regionId: 'pavlodar',
    image: require('../assets/pavlodar/bayanaul-park.jpg'),
    categories: ['nature', 'adventure', 'scenic'],
    workingHours: { 
      weekdays: '08:00 - 20:00', 
      weekend: '08:00 - 20:00', 
      dayOff: null 
    },
    contacts: { 
      phone: '+7 (71836) 2-13-58', 
      address: 'с. Баянаул',
      website: 'bayanaul.kz'
    },
    coordinates: { latitude: 52.5000, longitude: 75.7000 },
    historicalInfo: 'Создан в 1985 году как первый национальный парк Казахстана.',
    tips: [
      'Планируйте поездку на 2-3 дня',
      'Можно остановиться в гостевых домах',
      'Множество пешеходных маршрутов'
    ],
    rating: 4.9,
    visitDuration: '1-3 дня',
    bestTimeToVisit: 'Май-сентябь',
    accessibility: 'Требуется хорошая физическая подготовка'
  }
];

// Интересы для фильтрации
export const INTERESTS = [
  { id: 'religion', name: 'Религия', icon: 'moon' },
  { id: 'history', name: 'История', icon: 'book' },
  { id: 'culture', name: 'Культура', icon: 'color-palette' },
  { id: 'nature', name: 'Природа', icon: 'leaf' },
  { id: 'architecture', name: 'Архитектура', icon: 'business' },
  { id: 'recreation', name: 'Отдых', icon: 'happy' },
  { id: 'entertainment', name: 'Развлечения', icon: 'game-controller' },
  { id: 'scenic', name: 'Живописные места', icon: 'camera' },
  { id: 'unique', name: 'Уникальные места', icon: 'star' },
  { id: 'adventure', name: 'Приключения', icon: 'trail-sign' },
  { id: 'shopping', name: 'Шопинг', icon: 'bag' },
  { id: 'education', name: 'Образование', icon: 'school' }
];

// Маршруты для двух городов
export const ROUTES = [
  // АСТАНА
  {
    id: 'ast_route_1',
    name: 'Символы столицы',
    description: 'Знаковые достопримечательности Астаны за один день',
    duration: '4-5 часов',
    difficulty: 'Лёгкий',
    regionId: 'astana',
    attractions: ['ast001', 'ast002', 'ast003'], // Байтерек, Хан Шатыр, мечеть
    recommendedTransport: 'Автобус/Такси',
    distance: '15 км',
    estimatedCost: '1000-2000 тенге',
    tips: [
      'Начните с Байтерека утром',
      'В Хан Шатыре можно пообедать',
      'Посетите мечеть после обеда'
    ],
    highlights: [
      'Панорамный вид с Байтерека',
      'Уникальная архитектура Хан Шатыра',
      'Духовная атмосфера мечети'
    ]
  },
  
  // ПАВЛОДАР  
  {
    id: 'pvl_route_1',
    name: 'Культурное наследие Павлодара',
    description: 'Музеи и исторические места Павлодара',
    duration: '5-6 часов',
    difficulty: 'Средний',
    regionId: 'pavlodar',
    attractions: ['pvl004', 'pvl005', 'pvl002'], // Музеи и собор
    recommendedTransport: 'Пешком/Автобус',
    distance: '8 км',
    estimatedCost: '800-1500 тенге',
    tips: [
      'Музеи закрыты по понедельникам',
      'Экскурсии в музеях проводятся каждый час',
      'В соборе можно купить литературу'
    ],
    highlights: [
      'Литературное наследие Павла Васильева',
      'Археологические находки в музее',
      'Архитектура XIX века'
    ]
  },
  {
    id: 'pvl_route_2',
    name: 'Природа Прииртышья',
    description: 'Набережная Иртыша и Баянаульский парк',
    duration: '1-2 дня',
    difficulty: 'Средний',
    regionId: 'pavlodar',
    attractions: ['pvl003', 'pvl009'], // Набережная и парк
    recommendedTransport: 'Автомобиль',
    distance: '100 км',
    estimatedCost: '3000-8000 тенге',
    tips: [
      'Лучше планировать на выходные',
      'В парке можно остановиться на ночь',
      'Захватите теплую одежду'
    ],
    highlights: [
      'Великая сибирская река Иртыш',
      'Первый национальный парк Казахстана',
      'Уникальные природные ландшафты'
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