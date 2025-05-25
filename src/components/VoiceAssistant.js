import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Modal,
  Dimensions,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import AIService from '../services/AIService';

const { width, height } = Dimensions.get('window');

export const VoiceAssistant = ({ 
  currentLocation, 
  attractionsData, 
  onRouteGenerated, 
  style 
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));

  // Анимация пульсации
  useEffect(() => {
    if (isListening || isProcessing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isListening, isProcessing]);

  const handleVoiceButtonPress = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  const startListening = async () => {
    try {
      setIsModalVisible(true);
      setTranscribedText('');
      setResponseText('');
      setIsListening(true);

      await AIService.startListening(
        (text) => {
          console.log('Voice recognized:', text);
          setTranscribedText(text);
          processVoiceInput(text);
        },
        (error) => {
          console.error('Voice recognition error:', error);
          setIsListening(false);
          Alert.alert('Ошибка', 'Не удалось распознать речь. Попробуйте еще раз.');
        }
      );
    } catch (error) {
      console.error('Failed to start listening:', error);
      setIsListening(false);
      Alert.alert('Ошибка', 'Не удалось запустить распознавание речи.');
    }
  };

  const stopListening = async () => {
    try {
      await AIService.stopListening();
      setIsListening(false);
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  };

  const processVoiceInput = async (text) => {
    if (!text || text.trim().length === 0) {
      return;
    }

    try {
      setIsListening(false);
      setIsProcessing(true);

      const result = await AIService.processVoiceQuery(
        text,
        currentLocation,
        attractionsData,
        onRouteGenerated
      );

      if (result.success) {
        setResponseText(result.responseText);
      } else {
        setResponseText(result.responseText || 'Произошла ошибка при обработке запроса.');
      }
    } catch (error) {
      console.error('Voice processing error:', error);
      setResponseText('Произошла ошибка при обработке запроса.');
    } finally {
      setIsProcessing(false);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setTranscribedText('');
    setResponseText('');
    if (isListening) {
      stopListening();
    }
  };

  const getStatusText = () => {
    if (isListening) {
      return 'ИИ слушает...';
    } else if (isProcessing) {
      return 'ИИ обрабатывает запрос...';
    } else if (transcribedText) {
      return 'Готово!';
    }
    return 'Нажмите чтобы говорить с ИИ';
  };

  const getStatusIcon = () => {
    if (isListening) return 'radio-button-on';
    if (isProcessing) return 'sync';
    if (transcribedText) return 'checkmark-circle';
    return 'mic';
  };

  const processWithBackendAPI = async (recognizedText) => {
    try {
      console.log('🌐 AIService: Calling REAL backend API at', BACKEND_URL);
      
      // Используем реальное местоположение если доступно
      const requestData = {
        query: recognizedText,
        user_location: currentLocation || { 
          latitude: 52.3, 
          longitude: 76.95 
        }
      };
      
      console.log('📝 Request data:', requestData);
      
      // Тест health check
      console.log('🔍 Testing backend health...');
      try {
        const healthResponse = await fetch(`${BACKEND_URL}/ping`, {
          method: 'GET',
          timeout: 5000
        });
        
        if (healthResponse.ok) {
          console.log('✅ Backend health check passed');
        } else {
          console.warn('⚠️ Backend health check failed:', healthResponse.status);
        }
      } catch (healthError) {
        console.warn('⚠️ Backend health check failed:', healthError.message);
      }
      
      console.log('🚀 Making AI request...');
      const response = await fetch(`${BACKEND_URL}/ai/process-voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        timeout: 10000
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend API error response:', errorText);
        throw new Error(`HTTP ${response.status}: \nResponse: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Backend API success:', result);
      
      return result;
      
    } catch (error) {
      console.error('💥 Backend API failed:', error);
      throw error;
    }
  };

  return (
    <>
      {/* Floating AI Button */}
      <Animated.View style={[
        styles.floatingButton,
        { transform: [{ scale: pulseAnim }] },
        style
      ]}>
        <TouchableOpacity 
          style={[
            styles.aiButton,
            { 
              backgroundColor: theme.colors.primary,
              shadowColor: theme.colors.primary
            }
          ]}
          onPress={handleVoiceButtonPress}
          activeOpacity={0.8}
        >
          <Ionicons 
            name={isListening ? "radio-button-on" : "mic"} 
            size={28} 
            color="white" 
          />
          <Text style={styles.aiButtonText}>AI</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Modal для взаимодействия с ИИ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.headerLeft}>
                <View style={[styles.aiIndicator, { backgroundColor: theme.colors.primary }]}>
                  <Ionicons name="sparkles" size={16} color="white" />
                </View>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  AI Помощник TourGid
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              
              {/* Status Section */}
              <View style={styles.statusSection}>
                <Animated.View style={[
                  styles.micContainer,
                  { 
                    backgroundColor: isListening || isProcessing ? theme.colors.primary : theme.colors.cardBackground,
                    borderColor: theme.colors.border,
                    transform: [{ scale: pulseAnim }]
                  }
                ]}>
                  <Ionicons 
                    name={getStatusIcon()} 
                    size={48} 
                    color={isListening || isProcessing ? "white" : theme.colors.primary} 
                  />
                </Animated.View>
                
                <Text style={[styles.statusText, { color: theme.colors.text }]}>
                  {getStatusText()}
                </Text>
                
                <Text style={[styles.hintText, { color: theme.colors.textSecondary }]}>
                  Попробуйте: "Найди маршрут к Байтереку" или "Покажи музеи Павлодара"
                </Text>
              </View>

              {/* Transcribed Text */}
              {transcribedText ? (
                <View style={[styles.textSection, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Ваш запрос:
                  </Text>
                  <Text style={[styles.transcribedText, { color: theme.colors.text }]}>
                    "{transcribedText}"
                  </Text>
                </View>
              ) : null}

              {/* Response Text */}
              {responseText ? (
                <View style={[styles.textSection, { backgroundColor: theme.colors.cardBackground }]}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Ответ ИИ:
                  </Text>
                  <Text style={[styles.responseText, { color: theme.colors.text }]}>
                    {responseText}
                  </Text>
                </View>
              ) : null}

              {/* Action Buttons */}
              <View style={styles.buttonSection}>
                {!isListening && !isProcessing && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                    onPress={startListening}
                  >
                    <Ionicons name="mic" size={20} color="white" />
                    <Text style={styles.actionButtonText}>
                      Новый запрос
                    </Text>
                  </TouchableOpacity>
                )}
                
                {isListening && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                    onPress={stopListening}
                  >
                    <Ionicons name="stop" size={20} color="white" />
                    <Text style={styles.actionButtonText}>
                      Остановить
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 1000,
  },
  aiButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  aiButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    minHeight: height * 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  micContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  textSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transcribedText: {
    fontSize: 16,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  responseText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 