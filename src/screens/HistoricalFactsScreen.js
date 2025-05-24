import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const HISTORICAL_FACTS = [
  {
    id: '1',
    year: '1720',
    title: 'historicalFacts.pavlodarFoundation.title',
    description: 'historicalFacts.pavlodarFoundation.description',
    fullDescription: 'historicalFacts.pavlodarFoundation.fullDescription',
    image: require('../assets/historical/pavlodar-foundation.jpg')
  },
  {
    id: '2',
    year: '1861',
    title: 'historicalFacts.cityStatus.title',
    description: 'historicalFacts.cityStatus.description',
    fullDescription: 'historicalFacts.cityStatus.fullDescription',
    image: require('../assets/historical/pavlodar-city.jpeg')
  },
  {
    id: '3',
    year: '1954-1955',
    title: 'historicalFacts.virginLands.title',
    description: 'historicalFacts.virginLands.description',
    fullDescription: 'historicalFacts.virginLands.fullDescription',
    image: require('../assets/toktamys-mausoleum.jpg')
  },
  {
    id: '4',
    year: '1960-1980',
    title: 'historicalFacts.industrialDevelopment.title',
    description: 'historicalFacts.industrialDevelopment.description',
    fullDescription: 'historicalFacts.industrialDevelopment.fullDescription',
    image: require('../assets/jasybai-resort.jpg')
  }
];

export const HistoricalFactsScreen = () => {
  const [selectedFact, setSelectedFact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const { theme } = useTheme();
  const { t } = useTranslation();

  const openFactDetails = (fact) => {
    setSelectedFact(fact);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={HISTORICAL_FACTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.factCard, { backgroundColor: theme.colors.cardBackground }]}
            onPress={() => openFactDetails(item)}
            activeOpacity={0.7}
          >
            <Image source={item.image} style={styles.factImage} />
            <View style={styles.factContent}>
              <Text style={[styles.year, { color: theme.colors.primary }]}>{item.year}</Text>
              <Text style={[styles.title, { color: theme.colors.text }]}>{t(item.title)}</Text>
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{t(item.description)}</Text>
              <View style={styles.readMoreContainer}>
                <Text style={[styles.readMore, { color: theme.colors.primary }]}>{t('common.readMore')}</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            
            {selectedFact && (
              <ScrollView>
                <Image source={selectedFact.image} style={styles.modalImage} />
                <View style={styles.modalTextContent}>
                  <Text style={[styles.modalYear, { color: theme.colors.primary }]}>{selectedFact.year}</Text>
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>{t(selectedFact.title)}</Text>
                  <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
                    {t(selectedFact.fullDescription)}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  factCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  factImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  factContent: {
    padding: 16,
  },
  year: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  modalTextContent: {
    padding: 20,
  },
  modalYear: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 28,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 