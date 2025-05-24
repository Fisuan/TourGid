import React from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  Image, 
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export const AttractionDetailScreen = ({ route, navigation }) => {
  const { attraction } = route.params;
  const { theme } = useTheme();
  const { t } = useTranslation();

  const callPhone = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const openWebsite = (website) => {
    if (website) {
      Linking.openURL(`https://${website}`);
    }
  };

  const openEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image source={attraction.image} style={styles.headerImage} />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {attraction.name}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={theme.colors.primary} />
          <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
            {attraction.location}
          </Text>
        </View>

        {/* Рейтинг и базовая информация */}
        {attraction.rating && (
          <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.ratingRow}>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(attraction.rating)}
                </View>
                <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                  {attraction.rating}/5
                </Text>
              </View>
              {attraction.visitDuration && (
                <View style={styles.durationContainer}>
                  <Ionicons name="time" size={16} color={theme.colors.primary} />
                  <Text style={[styles.durationText, { color: theme.colors.textSecondary }]}>
                    {attraction.visitDuration}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          {attraction.description}
        </Text>

        {/* Историческая справка */}
        {attraction.historicalInfo && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.historicalInfo')}
            </Text>
            <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
              {attraction.historicalInfo}
            </Text>
          </View>
        )}

        {/* Время работы */}
        {attraction.workingHours && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.workingHours')}
            </Text>
            <View style={[styles.workingHoursCard, { backgroundColor: theme.colors.cardBackground }]}>
              <View style={styles.workingHoursRow}>
                <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>
                  {t('screens.attractionDetail.weekdays')}:
                </Text>
                <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>
                  {attraction.workingHours.weekdays}
                </Text>
              </View>
              <View style={styles.workingHoursRow}>
                <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>
                  {t('screens.attractionDetail.weekend')}:
                </Text>
                <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>
                  {attraction.workingHours.weekend}
                </Text>
              </View>
              {attraction.workingHours.dayOff && (
                <View style={styles.workingHoursRow}>
                  <Text style={[styles.workingHoursLabel, { color: theme.colors.text }]}>
                    {t('screens.attractionDetail.dayOff')}:
                  </Text>
                  <Text style={[styles.workingHoursValue, { color: theme.colors.textSecondary }]}>
                    {attraction.workingHours.dayOff}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Дополнительная информация */}
        {(attraction.bestTimeToVisit || attraction.accessibility) && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Полезная информация
            </Text>
            <View style={[styles.infoGrid, { backgroundColor: theme.colors.cardBackground }]}>
              {attraction.bestTimeToVisit && (
                <View style={styles.infoItem}>
                  <Ionicons name="sunny" size={20} color={theme.colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                      {t('screens.attractionDetail.bestTimeToVisit')}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
                      {attraction.bestTimeToVisit}
                    </Text>
                  </View>
                </View>
              )}
              {attraction.accessibility && (
                <View style={styles.infoItem}>
                  <Ionicons name="accessibility" size={20} color={theme.colors.primary} />
                  <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                      {t('screens.attractionDetail.accessibility')}
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.textSecondary }]}>
                      {attraction.accessibility}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Советы */}
        {attraction.tips && attraction.tips.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.tips')}
            </Text>
            <View style={[styles.tipsContainer, { backgroundColor: theme.colors.cardBackground }]}>
              {attraction.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Ionicons name="bulb" size={16} color={theme.colors.primary} />
                  <Text style={[styles.tipText, { color: theme.colors.textSecondary }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Контакты */}
        {attraction.contacts && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('screens.attractionDetail.contacts')}
            </Text>
            <View style={[styles.contactsCard, { backgroundColor: theme.colors.cardBackground }]}>
              {attraction.contacts.address && (
                <View style={styles.contactItem}>
                  <Ionicons name="location" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
                    {attraction.contacts.address}
                  </Text>
                </View>
              )}
              {attraction.contacts.phone && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => callPhone(attraction.contacts.phone)}
                >
                  <Ionicons name="call" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, styles.contactLink, { color: theme.colors.primary }]}>
                    {attraction.contacts.phone}
                  </Text>
                </TouchableOpacity>
              )}
              {attraction.contacts.email && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => openEmail(attraction.contacts.email)}
                >
                  <Ionicons name="mail" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, styles.contactLink, { color: theme.colors.primary }]}>
                    {attraction.contacts.email}
                  </Text>
                </TouchableOpacity>
              )}
              {attraction.contacts.website && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => openWebsite(attraction.contacts.website)}
                >
                  <Ionicons name="globe" size={20} color={theme.colors.primary} />
                  <Text style={[styles.contactText, styles.contactLink, { color: theme.colors.primary }]}>
                    {attraction.contacts.website}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Кнопка показать на карте */}
        <TouchableOpacity 
          style={[styles.mapButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Map', { selectedAttractions: [attraction.id] })}
        >
          <Ionicons name="map" size={20} color="#FFFFFF" />
          <Text style={styles.mapButtonText}>{t('common.showOnMap')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 30,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    marginLeft: 6,
    fontSize: 14,
    fontStyle: 'italic',
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 6,
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  workingHoursCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  workingHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workingHoursLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  workingHoursValue: {
    fontSize: 14,
  },
  infoGrid: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsContainer: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  contactsCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 14,
    flex: 1,
  },
  contactLink: {
    textDecorationLine: 'underline',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 