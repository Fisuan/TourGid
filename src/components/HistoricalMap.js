import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, View, Text } from 'react-native';
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');

export const HistoricalMap = ({ 
  attractions = [], 
  onMarkerPress, 
  showRoute = false,
  aiRoute = null,
  isAIRoute = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  const getInitialRegion = () => {
    if (isAIRoute && aiRoute) {
      // Для AI-маршрута показываем область между пользователем и пунктом назначения
      if (aiRoute.route.start && aiRoute.destination.coordinates) {
        const startLat = aiRoute.route.start.latitude;
        const startLng = aiRoute.route.start.longitude;
        const endLat = aiRoute.destination.coordinates.latitude;
        const endLng = aiRoute.destination.coordinates.longitude;

        const centerLat = (startLat + endLat) / 2;
        const centerLng = (startLng + endLng) / 2;
        
        const deltaLat = Math.abs(startLat - endLat) * 1.5;
        const deltaLng = Math.abs(startLng - endLng) * 1.5;

        return {
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: Math.max(deltaLat, 0.01),
          longitudeDelta: Math.max(deltaLng, 0.01),
        };
      }
    }

    if (attractions.length === 1) {
      const attraction = attractions[0];
      if (attraction.coordinates) {
        return {
          latitude: attraction.coordinates.latitude,
          longitude: attraction.coordinates.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
      }
    }

    // Астана по умолчанию
    return {
      latitude: 51.1694,
      longitude: 71.4491,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  };

  const getRouteCoordinates = () => {
    if (isAIRoute && aiRoute) {
      // Для AI-маршрута строим линию от пользователя к пункту назначения
      const coordinates = [];
      
      if (aiRoute.route.start) {
        coordinates.push({
          latitude: aiRoute.route.start.latitude,
          longitude: aiRoute.route.start.longitude
        });
      }
      
      // Добавляем путевые точки если есть
      if (aiRoute.route.waypoints && aiRoute.route.waypoints.length > 0) {
        aiRoute.route.waypoints.forEach(wp => {
          if (wp.coordinates) {
            coordinates.push({
              latitude: wp.coordinates.latitude,
              longitude: wp.coordinates.longitude
            });
          }
        });
      }
      
      if (aiRoute.destination.coordinates) {
        coordinates.push({
          latitude: aiRoute.destination.coordinates.latitude,
          longitude: aiRoute.destination.coordinates.longitude
        });
      }
      
      return coordinates;
    }

    // Обычный маршрут между достопримечательностями
    if (attractions.length < 2) return [];
    
    return attractions
      .filter(attraction => attraction.coordinates)
      .map(attraction => ({
        latitude: attraction.coordinates.latitude,
        longitude: attraction.coordinates.longitude
      }));
  };

  const renderUserLocationMarker = () => {
    if (!isAIRoute || !aiRoute || !aiRoute.route.start) return null;

    return (
      <View key="user-location">
        <Marker
          coordinate={{
            latitude: aiRoute.route.start.latitude,
            longitude: aiRoute.route.start.longitude
          }}
          title="Ваше местоположение"
          description="Отсюда начинается маршрут"
          pinColor="blue"
        />
        <Circle
          center={{
            latitude: aiRoute.route.start.latitude,
            longitude: aiRoute.route.start.longitude
          }}
          radius={100}
          fillColor="rgba(0, 122, 255, 0.2)"
          strokeColor="rgba(0, 122, 255, 0.5)"
          strokeWidth={2}
        />
      </View>
    );
  };

  const renderAttractionMarkers = () => {
    return attractions.map((attraction, index) => {
      if (!attraction.coordinates) return null;

      // Особый маркер для AI-пункта назначения
      const isAIDestination = isAIRoute && aiRoute && attraction.id === aiRoute.destination.id;
      
      return (
        <Marker
          key={attraction.id}
          coordinate={{
            latitude: attraction.coordinates.latitude,
            longitude: attraction.coordinates.longitude
          }}
          title={attraction.name}
          description={isAIDestination ? "🤖 Предложено AI: " + attraction.location : attraction.location}
          pinColor={isAIDestination ? "#FF6B35" : "#FF3B30"}
          onPress={() => onMarkerPress && onMarkerPress(attraction)}
        />
      );
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {isAIRoute ? 'Строим AI маршрут...' : t('common.loadingMap')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Ошибка загрузки карты: {error}
        </Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={getInitialRegion()}
      customMapStyle={isAIRoute ? aiMapStyle : historicalMapStyle}
      onError={(e) => setError(e.nativeEvent.error)}
      showsUserLocation={!isAIRoute} // Показываем встроенную локацию только если не AI маршрут
    >
      {/* Пользовательское местоположение для AI-маршрутов */}
      {renderUserLocationMarker()}
      
      {/* Маркеры достопримечательностей */}
      {renderAttractionMarkers()}
      
      {/* Маршрут */}
      {showRoute && (
        <Polyline
          coordinates={getRouteCoordinates()}
          strokeColor={isAIRoute ? "#FF6B35" : theme.colors.primary}
          strokeWidth={isAIRoute ? 5 : 4}
          lineDashPattern={isAIRoute ? [10, 5] : undefined}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  }
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