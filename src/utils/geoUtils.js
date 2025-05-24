// Геоутилиты для расчетов расстояний и маршрутов

// Google Maps API ключ (из app.json)
const GOOGLE_MAPS_API_KEY = 'AIzaSyDs42whH2dBmdmuNLIL2dN-i8C9VzxPVnU';

// 🆕 Google Directions API для реальных маршрутов
export async function getDirectionsFromGoogle(origin, destination, waypoints = [], travelMode = 'WALKING') {
  try {
    // Формируем URL для Google Directions API
    const originStr = `${origin.latitude},${origin.longitude}`;
    const destStr = `${destination.latitude},${destination.longitude}`;
    
    let waypointsStr = '';
    if (waypoints && waypoints.length > 0) {
      const waypointCoords = waypoints.map(wp => `${wp.latitude},${wp.longitude}`);
      waypointsStr = `&waypoints=optimize:true|${waypointCoords.join('|')}`;
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${originStr}&destination=${destStr}${waypointsStr}` +
      `&mode=${travelMode.toLowerCase()}&language=ru&region=kz` +
      `&key=${GOOGLE_MAPS_API_KEY}`;

    console.log('🗺️ Requesting directions from Google API...');
    
    // Устанавливаем таймаут для API запроса
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Увеличил до 8 секунд

    const response = await fetch(url, { 
      signal: controller.signal,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`❌ Google API HTTP error: ${response.status} - ${response.statusText}`);
      console.warn('📝 Нужно проверить:');
      console.warn('1. Включен ли Directions API в Google Cloud Console');
      console.warn('2. Настроена ли оплата (billing) для проекта');
      console.warn('3. Достаточно ли квоты для API вызовов');
      return createFallbackRoute(origin, destination, waypoints);
    }

    const data = await response.json();

    if (data.status === 'OK' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      
      console.log('✅ Google Directions API успешно работает!');
      return {
        success: true,
        route: {
          coordinates: decodePolyline(route.overview_polyline.points),
          distance: route.legs.reduce((total, leg) => total + leg.distance.value, 0) / 1000, // в км
          duration: route.legs.reduce((total, leg) => total + leg.duration.value, 0) / 60, // в минутах
          instructions: route.legs.flatMap(leg => 
            leg.steps.map(step => ({
              instruction: step.html_instructions.replace(/<[^>]*>/g, ''), // убираем HTML теги
              distance: step.distance.text,
              duration: step.duration.text,
              coordinates: {
                latitude: step.start_location.lat,
                longitude: step.start_location.lng
              }
            }))
          ),
          bounds: {
            northeast: route.bounds.northeast,
            southwest: route.bounds.southwest
          }
        },
        waypointOrder: data.routes[0].waypoint_order || []
      };
    } else {
      // Подробная диагностика ошибок Google API
      console.warn('❌ Google Directions API ошибка:', data.status);
      if (data.error_message) {
        console.warn('📄 Описание ошибки:', data.error_message);
      }
      
      // Конкретные рекомендации по исправлению
      switch (data.status) {
        case 'REQUEST_DENIED':
          console.warn('🔑 Решение: Нужно включить Directions API в Google Cloud Console');
          console.warn('📍 Ссылка: https://console.cloud.google.com/apis/library/directions-backend.googleapis.com');
          break;
        case 'OVER_DAILY_LIMIT':
        case 'OVER_QUERY_LIMIT':
          console.warn('💰 Решение: Превышена квота API. Нужно настроить billing или увеличить лимиты');
          break;
        case 'INVALID_REQUEST':
          console.warn('📝 Решение: Проверьте корректность координат');
          break;
        case 'ZERO_RESULTS':
          console.warn('🚫 Маршрут не найден для данных координат');
          break;
        default:
          console.warn('❓ Неизвестная ошибка Google API');
      }
      
      return createFallbackRoute(origin, destination, waypoints);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⏱️ Google API таймаут (8 сек). Проверьте интернет соединение');
    } else {
      console.warn('🌐 Google API недоступен:', error.message);
    }
    console.warn('🔄 Используем резервный алгоритм маршрутизации');
    return createFallbackRoute(origin, destination, waypoints);
  }
}

// 🆕 Создание fallback маршрута прямыми линиями
function createFallbackRoute(origin, destination, waypoints = []) {
  console.log('📍 Using fallback route (interpolated lines)');
  
  const points = [origin, ...waypoints, destination];
  const coordinates = [];
  
  // Создаем много промежуточных точек для плавного маршрута
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    
    // Генерируем 50 промежуточных точек между каждой парой для очень плавной линии
    const segmentPoints = generateRoutePoints(start, end, 50);
    
    // Добавляем точки, избегая дублирования
    if (i === 0) {
      coordinates.push(...segmentPoints);
    } else {
      coordinates.push(...segmentPoints.slice(1)); // пропускаем первую точку чтобы избежать дублирования
    }
  }
  
  const totalDistance = calculateRouteDistance(points);
  const estimatedDuration = estimateTravelTime(totalDistance, 'walking');
  
  // Создаем подробные инструкции для каждого сегмента
  const instructions = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const segmentDistance = calculateDistance(
      start.latitude, start.longitude,
      end.latitude, end.longitude
    );
    const bearing = calculateBearing(
      start.latitude, start.longitude,
      end.latitude, end.longitude
    );
    
    let direction = 'на север';
    if (bearing >= 315 || bearing < 45) direction = 'на север';
    else if (bearing >= 45 && bearing < 135) direction = 'на восток';
    else if (bearing >= 135 && bearing < 225) direction = 'на юг';
    else if (bearing >= 225 && bearing < 315) direction = 'на запад';

    instructions.push({
      instruction: i === 0 
        ? `Начните движение ${direction}` 
        : `Продолжайте движение ${direction}`,
      distance: `${segmentDistance.toFixed(1)} км`,
      duration: `${Math.round(estimateTravelTime(segmentDistance, 'walking'))} мин`,
      coordinates: start
    });
  }

  // Добавляем финальную инструкцию
  instructions.push({
    instruction: `Прибытие в пункт назначения`,
    distance: '0 м',
    duration: '0 мин',
    coordinates: destination
  });
  
  return {
    success: true,
    route: {
      coordinates,
      distance: totalDistance,
      duration: estimatedDuration,
      instructions,
      bounds: getBoundingBox(points, 0.005) // меньший отступ для лучшего масштабирования
    },
    waypointOrder: waypoints.map((_, index) => index),
    isFallback: true
  };
}

// 🆕 Декодирование Google Polyline в координаты
function decodePolyline(encoded) {
  const coordinates = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    coordinates.push({
      latitude: lat / 1E5,
      longitude: lng / 1E5
    });
  }

  return coordinates;
}

// 🆕 Получение маршрута между достопримечательностями
export async function getRouteToAttraction(userLocation, attraction, travelMode = 'WALKING') {
  if (!userLocation || !attraction || !attraction.coordinates) {
    return null;
  }

  const directionsResult = await getDirectionsFromGoogle(
    userLocation,
    attraction.coordinates,
    [],
    travelMode
  );

  return {
    ...directionsResult,
    destination: attraction,
    travelMode
  };
}

// 🆕 Построение многоточечного маршрута через несколько достопримечательностей
export async function getMultiPointRoute(userLocation, attractions, travelMode = 'WALKING') {
  if (!userLocation || !attractions || attractions.length === 0) {
    return null;
  }

  // Если одна достопримечательность
  if (attractions.length === 1) {
    return getRouteToAttraction(userLocation, attractions[0], travelMode);
  }

  // Если несколько - делаем оптимизированный маршрут
  const destination = attractions[attractions.length - 1];
  const waypoints = attractions.slice(0, -1).map(attraction => attraction.coordinates);

  const directionsResult = await getDirectionsFromGoogle(
    userLocation,
    destination.coordinates,
    waypoints,
    travelMode
  );

  return {
    ...directionsResult,
    attractions,
    travelMode,
    isMultiPoint: true
  };
}

// 🆕 Получение маршрута общественным транспортом
export async function getPublicTransportRoute(userLocation, destination) {
  return getDirectionsFromGoogle(userLocation, destination, [], 'TRANSIT');
}

// 🆕 Получение маршрута на автомобиле
export async function getDrivingRoute(userLocation, destination, waypoints = []) {
  return getDirectionsFromGoogle(userLocation, destination, waypoints, 'DRIVING');
}

// 🆕 Анализ маршрута для рекомендаций
export function analyzeRoute(routeResult) {
  if (!routeResult || !routeResult.success) {
    return null;
  }

  const { route } = routeResult;
  const analysis = {
    difficulty: 'easy',
    recommendations: [],
    warnings: [],
    estimatedCost: 0
  };

  // Анализ сложности по расстоянию и времени
  if (route.distance > 20) {
    analysis.difficulty = 'hard';
    analysis.recommendations.push('Рекомендуем использовать транспорт');
  } else if (route.distance > 10) {
    analysis.difficulty = 'medium';
    analysis.recommendations.push('Возьмите воду и удобную обувь');
  }

  // Анализ времени
  if (route.duration > 120) {
    analysis.warnings.push('Маршрут займет более 2 часов');
    analysis.recommendations.push('Запланируйте перерывы');
  }

  // Примерная стоимость (для такси/общественного транспорта)
  if (routeResult.travelMode === 'DRIVING') {
    analysis.estimatedCost = Math.round(route.distance * 50); // 50 тенге за км
    analysis.recommendations.push(`Примерная стоимость такси: ${analysis.estimatedCost} тенге`);
  } else if (routeResult.travelMode === 'TRANSIT') {
    analysis.estimatedCost = 150; // фиксированная стоимость проезда
    analysis.recommendations.push(`Стоимость проезда: ${analysis.estimatedCost} тенге`);
  }

  return analysis;
}

// 🆕 Поиск ближайших остановок общественного транспорта
export async function findNearbyTransitStops(location, radius = 500) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${location.latitude},${location.longitude}` +
      `&radius=${radius}&type=transit_station&language=ru` +
      `&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.results.map(place => ({
        name: place.name,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        distance: calculateDistance(
          location.latitude, location.longitude,
          place.geometry.location.lat, place.geometry.location.lng
        ),
        types: place.types,
        rating: place.rating || 0
      }));
    }
  } catch (error) {
    console.error('Error finding transit stops:', error);
  }
  
  return [];
}

// Расчет расстояния между двумя точками по формуле гаверсинуса
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Радиус Земли в км
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Расстояние в км
  
  return distance;
}

// Конвертация градусов в радианы
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Расчет азимута (направления) между двумя точками
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const dLon = toRadians(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
  const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) - 
            Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  return (toDegrees(bearing) + 360) % 360;
}

// Конвертация радианов в градусы
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

// Проверка находится ли точка в заданном радиусе
export function isWithinRadius(centerLat, centerLon, pointLat, pointLon, radiusKm) {
  const distance = calculateDistance(centerLat, centerLon, pointLat, pointLon);
  return distance <= radiusKm;
}

// Расчет центральной точки между несколькими координатами
export function calculateCentroid(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let totalLat = 0;
  let totalLon = 0;
  
  coordinates.forEach(coord => {
    totalLat += coord.latitude;
    totalLon += coord.longitude;
  });
  
  return {
    latitude: totalLat / coordinates.length,
    longitude: totalLon / coordinates.length
  };
}

// Оптимизация маршрута методом ближайшего соседа (простой TSP solver)
export function optimizeRouteOrder(startPoint, waypoints, endPoint) {
  if (!waypoints || waypoints.length === 0) {
    return [startPoint, endPoint];
  }

  const result = [startPoint];
  const unvisited = [...waypoints];
  let currentPoint = startPoint;

  while (unvisited.length > 0) {
    let nearestIndex = 0;
    let nearestDistance = calculateDistance(
      currentPoint.latitude, currentPoint.longitude,
      unvisited[0].latitude, unvisited[0].longitude
    );

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(
        currentPoint.latitude, currentPoint.longitude,
        unvisited[i].latitude, unvisited[i].longitude
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    currentPoint = unvisited[nearestIndex];
    result.push(currentPoint);
    unvisited.splice(nearestIndex, 1);
  }

  if (endPoint) {
    result.push(endPoint);
  }

  return result;
}

// Расчет общей длины маршрута
export function calculateRouteDistance(waypoints) {
  if (!waypoints || waypoints.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalDistance += calculateDistance(
      waypoints[i].latitude, waypoints[i].longitude,
      waypoints[i + 1].latitude, waypoints[i + 1].longitude
    );
  }

  return totalDistance;
}

// Расчет примерного времени в пути
export function estimateTravelTime(distanceKm, transportMode = 'walking') {
  const speeds = {
    walking: 4.5, // км/ч
    cycling: 15,  // км/ч
    driving: 40,  // км/ч (городские условия)
    public_transport: 20 // км/ч
  };

  const speed = speeds[transportMode] || speeds.walking;
  return (distanceKm / speed) * 60; // возвращаем в минутах
}

// Создание ограничивающего прямоугольника для набора точек
export function getBoundingBox(coordinates, padding = 0.01) {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLon = coordinates[0].longitude;
  let maxLon = coordinates[0].longitude;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLon = Math.min(minLon, coord.longitude);
    maxLon = Math.max(maxLon, coord.longitude);
  });

  return {
    southwest: { latitude: minLat - padding, longitude: minLon - padding },
    northeast: { latitude: maxLat + padding, longitude: maxLon + padding }
  };
}

// Генерация промежуточных точек для плавной линии маршрута
export function generateRoutePoints(startPoint, endPoint, numPoints = 10) {
  const points = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    const lat = startPoint.latitude + (endPoint.latitude - startPoint.latitude) * ratio;
    const lon = startPoint.longitude + (endPoint.longitude - startPoint.longitude) * ratio;
    
    points.push({ latitude: lat, longitude: lon });
  }
  
  return points;
}

// Проверка валидности координат
export function isValidCoordinate(latitude, longitude) {
  return (
    typeof latitude === 'number' && 
    typeof longitude === 'number' &&
    latitude >= -90 && latitude <= 90 &&
    longitude >= -180 && longitude <= 180
  );
}

// Форматирование координат для отображения
export function formatCoordinates(latitude, longitude, precision = 6) {
  if (!isValidCoordinate(latitude, longitude)) {
    return 'Invalid coordinates';
  }
  
  return `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;
}

// 🆕 Определение ближайшего региона пользователя
export function findNearestRegion(userLatitude, userLongitude, regions) {
  if (!userLatitude || !userLongitude || !regions || regions.length === 0) {
    // По умолчанию возвращаем Астану (столица)
    return regions.find(r => r.id === 'astana') || regions[0];
  }

  let nearestRegion = regions[0];
  let shortestDistance = calculateDistance(
    userLatitude, userLongitude, 
    regions[0].coordinates.latitude, regions[0].coordinates.longitude
  );

  regions.forEach(region => {
    const distance = calculateDistance(
      userLatitude, userLongitude,
      region.coordinates.latitude, region.coordinates.longitude
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestRegion = region;
    }
  });

  console.log(`🎯 Nearest region: ${nearestRegion.name} (${shortestDistance.toFixed(1)}km away)`);
  return nearestRegion;
}

// 🆕 Фильтрация достопримечательностей по региону
export function filterAttractionsByRegion(attractions, regionId) {
  if (!regionId) return attractions;
  
  const filtered = attractions.filter(attraction => attraction.regionId === regionId);
  console.log(`📍 Filtered ${filtered.length} attractions for region: ${regionId}`);
  return filtered;
}

// 🆕 Получение достопримечательностей в радиусе от пользователя
export function getAttractionsInRadius(userLocation, attractions, radiusKm = 100) {
  if (!userLocation || !attractions) return attractions;

  const nearbyAttractions = attractions.filter(attraction => {
    if (!attraction.coordinates) return false;
    
    const distance = calculateDistance(
      userLocation.latitude, userLocation.longitude,
      attraction.coordinates.latitude, attraction.coordinates.longitude
    );
    
    return distance <= radiusKm;
  });

  console.log(`📍 Found ${nearbyAttractions.length} attractions within ${radiusKm}km radius`);
  return nearbyAttractions;
}

// 🆕 Умная фильтрация: сначала по региону, потом по радиусу
export function getSmartFilteredAttractions(userLocation, attractions, regions, radiusKm = 200) {
  if (!userLocation || !attractions || !regions) {
    return { attractions, region: null, isNearbyRegion: false };
  }

  // 1. Определяем ближайший регион
  const nearestRegion = findNearestRegion(
    userLocation.latitude, 
    userLocation.longitude, 
    regions
  );

  // 2. Проверяем расстояние до центра региона
  const distanceToRegionCenter = calculateDistance(
    userLocation.latitude, userLocation.longitude,
    nearestRegion.coordinates.latitude, nearestRegion.coordinates.longitude
  );

  // 3. Если пользователь близко к центру региона (< 50км), показываем только этот регион
  if (distanceToRegionCenter <= 50) {
    const regionAttractions = filterAttractionsByRegion(attractions, nearestRegion.id);
    return { 
      attractions: regionAttractions, 
      region: nearestRegion, 
      isNearbyRegion: true,
      distance: distanceToRegionCenter 
    };
  }

  // 4. Иначе показываем все достопримечательности в радиусе
  const nearbyAttractions = getAttractionsInRadius(userLocation, attractions, radiusKm);
  return { 
    attractions: nearbyAttractions, 
    region: nearestRegion, 
    isNearbyRegion: false,
    distance: distanceToRegionCenter 
  };
} 