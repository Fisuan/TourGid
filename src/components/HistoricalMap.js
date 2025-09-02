import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { 
  getDirectionsFromGoogle, 
  getRouteToAttraction, 
  getMultiPointRoute,
  analyzeRoute,
  getBoundingBox,
  calculateDistance 
} from '../utils/geoUtils';

const { width, height } = Dimensions.get('window');

export const HistoricalMap = ({ 
  attractions = [], 
  onMarkerPress, 
  showRoute = false,
  aiRoute = null,
  isAIRoute = false
}) => {
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const { t } = useTranslation();

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [travelMode, setTravelMode] = useState('WALKING');
  const [routeAnalysis, setRouteAnalysis] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Обновление маршрута при изменении параметров
  useEffect(() => {
    if (showRoute && attractions && attractions.length > 1) {
      generateRoute();
    } else if (isAIRoute && aiRoute) {
      generateAIRoute();
    } else {
      clearRoute();
    }
  }, [showRoute, attractions, aiRoute, isAIRoute, travelMode]);

  // 🆕 Генерация маршрута через Google Directions API
  const generateRoute = async () => {
    if (!attractions || attractions.length < 2) return;

    setIsLoadingRoute(true);
    try {
      // Берем первую точку как старт
      const startPoint = attractions[0].coordinates;
      const endPoint = attractions[attractions.length - 1].coordinates;
      const waypoints = attractions.slice(1, -1).map(attr => attr.coordinates);

      console.log('🗺️ Generating route with Google Directions...');
      
      const routeResult = await getDirectionsFromGoogle(
        startPoint,
        endPoint,
        waypoints,
        travelMode
      );

      if (routeResult.success) {
        setRouteCoordinates(routeResult.route.coordinates);
        setRouteInfo({
          distance: routeResult.route.distance,
          duration: routeResult.route.duration,
          instructions: routeResult.route.instructions,
          isFallback: routeResult.isFallback
        });

        // Анализ маршрута
        const analysis = analyzeRoute(routeResult);
        setRouteAnalysis(analysis);

        // Центрируем карту на маршрут
        if (routeResult.route.bounds && mapRef.current) {
          mapRef.current.fitToCoordinates(routeResult.route.coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }

        console.log(`✅ Route generated: ${routeResult.route.distance.toFixed(1)}km, ${Math.round(routeResult.route.duration)}min`);
      }
    } catch (error) {
      console.error('Error generating route:', error);
      Alert.alert(
        'Ошибка маршрута',
        'Не удалось построить маршрут. Используем прямые линии.',
        [{ text: 'ОК' }]
      );
      generateFallbackRoute();
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // 🆕 Генерация AI маршрута
  const generateAIRoute = async () => {
    if (!aiRoute || !aiRoute.destination) return;

    setIsLoadingRoute(true);
    try {
      // Получаем текущее местоположение пользователя или используем центр ближайшего региона
      let startLocation = userLocation;
      if (!startLocation) {
        // Fallback на координаты центра карты или первой достопримечательности
        startLocation = attractions?.[0]?.coordinates || {
          latitude: 52.3000, // Павлодар (исправлено с Астаны)
          longitude: 76.9500
        };
      }

      const routeResult = await getRouteToAttraction(
        startLocation,
        aiRoute.destination,
        travelMode
      );

      if (routeResult && routeResult.success) {
        setRouteCoordinates(routeResult.route.coordinates);
        setRouteInfo({
          distance: routeResult.route.distance,
          duration: routeResult.route.duration,
          instructions: routeResult.route.instructions,
          isAI: true,
          destination: aiRoute.destination.name
        });

        // Анализ AI маршрута
        const analysis = analyzeRoute(routeResult);
        setRouteAnalysis(analysis);

        // Центрируем карту на AI маршрут
        if (routeResult.route.coordinates.length > 0 && mapRef.current) {
          mapRef.current.fitToCoordinates(routeResult.route.coordinates, {
            edgePadding: { top: 100, right: 50, bottom: 200, left: 50 },
            animated: true,
          });
        }

        console.log(`🤖 AI route generated to ${aiRoute.destination.name}`);
      }
    } catch (error) {
      console.error('Error generating AI route:', error);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Fallback маршрут прямыми линиями
  const generateFallbackRoute = () => {
    if (!attractions || attractions.length < 2) return;

    const coordinates = [];
    for (let i = 0; i < attractions.length - 1; i++) {
      const start = attractions[i].coordinates;
      const end = attractions[i + 1].coordinates;
      
      // Создаем промежуточные точки для плавной линии
      for (let j = 0; j <= 20; j++) {
        const ratio = j / 20;
        const lat = start.latitude + (end.latitude - start.latitude) * ratio;
        const lng = start.longitude + (end.longitude - start.longitude) * ratio;
        coordinates.push({ latitude: lat, longitude: lng });
      }
    }

    setRouteCoordinates(coordinates);
    
    // Примерный расчет расстояния
    let totalDistance = 0;
    for (let i = 0; i < attractions.length - 1; i++) {
      totalDistance += calculateDistance(
        attractions[i].coordinates.latitude,
        attractions[i].coordinates.longitude,
        attractions[i + 1].coordinates.latitude,
        attractions[i + 1].coordinates.longitude
      );
    }

    setRouteInfo({
      distance: totalDistance,
      duration: (totalDistance / 4.5) * 60, // примерно 4.5 км/ч пешком
      isFallback: true
    });
  };

  // Очистка маршрута
  const clearRoute = () => {
    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteAnalysis(null);
  };

  // 🆕 Переключение типа транспорта
  const switchTravelMode = () => {
    const modes = [
      { key: 'WALKING', name: 'Пешком', icon: 'walk' },
      { key: 'DRIVING', name: 'На машине', icon: 'car' },
      { key: 'TRANSIT', name: 'Транспорт', icon: 'bus' }
    ];

    const currentIndex = modes.findIndex(mode => mode.key === travelMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTravelMode(modes[nextIndex].key);
  };

  // 🆕 Получение иконки текущего режима транспорта
  const getTravelModeIcon = () => {
    switch (travelMode) {
      case 'DRIVING': return 'car';
      case 'TRANSIT': return 'bus';
      default: return 'walk';
    }
  };

  // 🆕 Показать детали маршрута
  const showRouteDetails = () => {
    if (!routeInfo) return;

    const details = [
      `📏 Расстояние: ${routeInfo.distance.toFixed(1)} км`,
      `⏱️ Время: ${Math.round(routeInfo.duration)} мин`,
    ];

    if (routeInfo.isAI) {
      details.unshift(`🤖 AI маршрут к ${routeInfo.destination}`);
    }

    if (routeInfo.isFallback) {
      details.push('⚠️ Приблизительный маршрут (прямые линии)');
    }

    if (routeAnalysis) {
      if (routeAnalysis.recommendations.length > 0) {
        details.push('', '💡 Рекомендации:');
        details.push(...routeAnalysis.recommendations);
      }
      
      if (routeAnalysis.warnings.length > 0) {
        details.push('', '⚠️ Предупреждения:');
        details.push(...routeAnalysis.warnings);
      }
    }

    Alert.alert('Детали маршрута', details.join('\n'), [{ text: 'ОК' }]);
  };

  // Определение центра карты
  const getMapCenter = () => {
    if (attractions && attractions.length > 0) {
      // Используем первую достопримечательность как центр
      return attractions[0].coordinates;
    }
    
    // Fallback на Павлодар (исправлено с Астаны)
    return {
      latitude: 52.3000,
      longitude: 76.9500,
    };
  };

  if (isLoadingRoute) {
    return (
      <View style={[styles.loadingOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.cardBackground }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            {isAIRoute ? 'Строим AI маршрут...' : 'Построение маршрута...'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          ...getMapCenter(),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onUserLocationChange={(event) => {
          if (event.nativeEvent.coordinate) {
            setUserLocation(event.nativeEvent.coordinate);
          }
        }}
      >
        {/* Маркеры достопримечательностей */}
        {attractions.map((attraction, index) => (
          <Marker
            key={attraction.id}
            coordinate={attraction.coordinates}
            title={attraction.name}
            description={attraction.description}
            onPress={() => onMarkerPress && onMarkerPress(attraction)}
          >
            <View style={[
              styles.markerContainer,
              { backgroundColor: isAIRoute && aiRoute?.destination?.id === attraction.id ? '#FF6B35' : theme.colors.primary }
            ]}>
              <Text style={styles.markerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}

        {/* Линия маршрута */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={isAIRoute ? '#FF6B35' : theme.colors.primary}
            strokeWidth={4}
            lineDashPattern={routeInfo?.isFallback ? [10, 5] : null}
          />
        )}
      </MapView>

      {/* 🆕 Панель управления маршрутом */}
      {(showRoute || isAIRoute) && (
        <View style={[styles.routeControls, { backgroundColor: theme.colors.cardBackground }]}>
          <TouchableOpacity 
            style={[styles.controlButton, { backgroundColor: theme.colors.primary }]}
            onPress={switchTravelMode}
          >
            <Ionicons name={getTravelModeIcon()} size={20} color="white" />
          </TouchableOpacity>

          {routeInfo && (
            <TouchableOpacity 
              style={styles.routeInfoContainer}
              onPress={showRouteDetails}
            >
              <Text style={[styles.routeInfoText, { color: theme.colors.text }]}>
                {routeInfo.distance.toFixed(1)} км • {Math.round(routeInfo.duration)} мин
              </Text>
              {isAIRoute && (
                <Text style={[styles.aiLabel, { color: theme.colors.primary }]}>
                  🤖 AI маршрут
                </Text>
              )}
              {routeInfo.isFallback && (
                <Text style={styles.fallbackLabel}>
                  📍 Приблизительно
                </Text>
              )}
            </TouchableOpacity>
          )}

          {isLoadingRoute && (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  routeInfoContainer: {
    flex: 1,
  },
  routeInfoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  fallbackLabel: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 2,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

// Стиль карты для AI-маршрутов (более современный)
const aiMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c9d6ff"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  }
];

// Стиль карты под старину (оригинальный)
const historicalMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ebe3cd"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#523735"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f1e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#c9b2a6"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#dcd2be"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#ae9e90"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dfd2ae"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#93817c"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a5b076"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#447530"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b9d3c2"
      }
    ]
  }
]; 