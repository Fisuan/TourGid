// Геоутилиты для расчетов расстояний и маршрутов

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