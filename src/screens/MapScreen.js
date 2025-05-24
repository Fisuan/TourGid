import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Switch
} from 'react-native';
import { HistoricalMap } from '../components/HistoricalMap';
import { ATTRACTIONS, ROUTES } from '../constants/data';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const MapScreen = ({ route, navigation }) => {
  const { selectedAttractions, selectedRoute, aiRoute, destination } = route.params || {};
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [showRoute, setShowRoute] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAIRoute, setIsAIRoute] = useState(false);
  
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Определяем, какие достопримечательности показывать
  useEffect(() => {
    let attractionsToShow = [];
    
    if (aiRoute) {
      // AI-сгенерированный маршрут
      setIsAIRoute(true);
      setShowRoute(true); // Автоматически показываем AI маршрут
      
      attractionsToShow = [aiRoute.destination];
      
      // Если есть путевые точки, добавляем их тоже
      if (aiRoute.route.waypoints && aiRoute.route.waypoints.length > 0) {
        const waypointAttractions = aiRoute.route.waypoints
          .map(wp => ATTRACTIONS.find(a => a.id === wp.attractionId))
          .filter(Boolean);
        attractionsToShow = [...attractionsToShow, ...waypointAttractions];
      }
    } else if (selectedRoute) {
      // Если выбран маршрут, получаем все его достопримечательности
      const routeData = ROUTES.find(r => r.id === selectedRoute);
      if (routeData) {
        attractionsToShow = routeData.attractions
          .map(id => ATTRACTIONS.find(a => a.id === id))
          .filter(Boolean);
        // Автоматически включаем отображение маршрута
        setShowRoute(true);
      }
    } else if (selectedAttractions && selectedAttractions.length > 0) {
      attractionsToShow = ATTRACTIONS.filter(a => selectedAttractions.includes(a.id));
    } else {
      attractionsToShow = ATTRACTIONS;
    }
    
    setAttractions(attractionsToShow);
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [selectedAttractions, selectedRoute, aiRoute]);

  const handleMarkerPress = (attraction) => {
    setSelectedMarker(attraction);
  };

  const handleDetailsPress = (attraction) => {
    navigation.navigate('AttractionDetail', { attraction });
  };

  const renderAIRouteInfo = () => {
    if (!isAIRoute || !aiRoute) return null;

    return (
      <View style={[styles.aiRouteInfo, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.aiRouteHeader}>
          <Ionicons name="sparkles" size={20} color="white" />
          <Text style={styles.aiRouteTitle}>AI Маршрут</Text>
        </View>
        <Text style={styles.aiRouteDestination}>
          К {aiRoute.destination.name}
        </Text>
        {aiRoute.route.preferences && aiRoute.route.preferences.length > 0 && (
          <View style={styles.aiPreferences}>
            {aiRoute.route.preferences.map((pref, index) => (
              <View key={index} style={styles.preferenceTag}>
                <Text style={styles.preferenceText}>
                  {getPreferenceLabel(pref)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const getPreferenceLabel = (preference) => {
    const labels = {
      'scenic': '🌅 Живописный',
      'historical': '🏛️ Исторический',
      'cultural': '🎨 Культурный',
      'short': '⚡ Быстрый',
      'avoid_crowds': '🚶 Без толп'
    };
    return labels[preference] || preference;
  };

  const renderAttractionPanel = () => {
    if (!selectedMarker) return null;

    return (
      <View style={[styles.attractionPanel, { backgroundColor: theme.colors.cardBackground }]}>
        {isAIRoute && (
          <View style={styles.aiPanelHeader}>
            <Ionicons name="sparkles" size={16} color={theme.colors.primary} />
            <Text style={[styles.aiPanelText, { color: theme.colors.primary }]}>
              Предложено AI
            </Text>
          </View>
        )}
        
        <Text style={[styles.attractionName, { color: theme.colors.text }]}>
          {selectedMarker.name}
        </Text>
        <Text style={[styles.attractionLocation, { color: theme.colors.textSecondary }]}>
          {selectedMarker.location}
        </Text>
        
        <TouchableOpacity 
          style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => handleDetailsPress(selectedMarker)}
        >
          <Text style={styles.detailsButtonText}>{t('screens.attractionDetail.title')}</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderAIRouteInfo()}
      
      {attractions.length > 1 && !isAIRoute && (
        <View style={[styles.routeToggle, { backgroundColor: theme.colors.cardBackground }]}>
          <Text style={[styles.routeToggleText, { color: theme.colors.text }]}>
            Показать маршрут
          </Text>
          <Switch
            value={showRoute}
            onValueChange={setShowRoute}
            trackColor={{ false: "#767577", true: theme.colors.primary + "80" }}
            thumbColor={showRoute ? theme.colors.primary : "#f4f3f4"}
          />
        </View>
      )}
      
      <HistoricalMap 
        attractions={attractions}
        onMarkerPress={handleMarkerPress}
        showRoute={showRoute}
        aiRoute={aiRoute}
        isAIRoute={isAIRoute}
      />
      
      {renderAttractionPanel()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  aiRouteInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  aiRouteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiRouteTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  aiRouteDestination: {
    color: 'white',
    fontSize: 14,
    marginBottom: 8,
  },
  aiPreferences: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  preferenceTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  preferenceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  routeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  routeToggleText: {
    marginRight: 8,
    fontSize: 14,
  },
  attractionPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  aiPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPanelText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  attractionLocation: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  detailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  }
}); 