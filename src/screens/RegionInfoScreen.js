import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export const RegionInfoScreen = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image 
        source={require('../assets/placeholder.js')} 
        style={styles.headerImage}
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Павлодарская область
        </Text>
        
        <View style={[styles.infoCard, { backgroundColor: theme.colors.cardBackground }]}>
          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.description')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.population')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="thermometer" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.climate')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              {t('regionInfo.economy')}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          География
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.geography')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          История
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          Основан в 1720 году как Коряковский форпост. В 1861 переименован в Павлодар. Активное развитие началось в 1950-х с освоением целины и строительством промышленных предприятий. В советское время стал крупным индустриальным центром Казахстана.
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Культура
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.culture')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Природа
        </Text>
        <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
          {t('regionInfo.nature')}
        </Text>
        
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Главные достопримечательности
        </Text>
        <View style={styles.attractionsList}>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            • Мечеть Машхур Жусупа - духовный центр региона
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            • Благовещенский собор - памятник архитектуры XIX века
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            • Набережная Иртыша - главная прогулочная зона
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            • Баянаульский национальный парк - первый в Казахстане
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            • Соленое озеро Маралды - природная лечебница
          </Text>
          <Text style={[styles.attractionItem, { color: theme.colors.textSecondary }]}>
            • Дом-музей Павла Васильева - литературное наследие
          </Text>
        </View>
        
        <View style={styles.linksContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('regionInfo.links')}
          </Text>
          
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => Linking.openURL('https://pavlodar.gov.kz/ru')}
          >
            <Ionicons name="globe" size={20} color="#FFFFFF" />
            <Text style={styles.linkText}>
              {t('regionInfo.officialSite')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => Linking.openURL('https://kazakhstan.travel/ru/guide/regions/pavlodar')}
          >
            <Ionicons name="airplane" size={20} color="#FFFFFF" />
            <Text style={styles.linkText}>
              {t('regionInfo.touristPortal')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.linkButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => Linking.openURL('https://2gis.kz/pavlodar')}
          >
            <Ionicons name="map" size={20} color="#FFFFFF" />
            <Text style={styles.linkText}>
              {t('regionInfo.map')}
            </Text>
          </TouchableOpacity>
        </View>
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
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoCard: {
    marginBottom: 25,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  attractionsList: {
    marginBottom: 20,
  },
  attractionItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  linksContainer: {
    marginTop: 10,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  linkText: {
    color: '#FFFFFF',
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});