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
  const [aiServicesStatus, setAiServicesStatus] = useState(null);
  const [isEnhancedMode, setIsEnhancedMode] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Инициализация продвинутых AI сервисов при первой загрузке
  useEffect(() => {
    initializeAdvancedAI();
  }, []);

  const initializeAdvancedAI = async () => {
    try {
      console.log('VoiceAssistant: Initializing advanced AI services...');
      
      const config = {
        livekit: {
          enabled: true, // Включаем для тестирования
          serverUrl: null // Используем тестовый URL из LiveKitService
        },
        fetchai: {
          enabled: true, // Включаем для тестирования
          apiKey: 'test_api_key' // В реальном проекте из env
        }
      };

      const initResult = await AIService.initializeAdvancedServices(config);
      
      if (initResult.livekit || initResult.fetchai) {
        setIsEnhancedMode(true);
        console.log('VoiceAssistant: Enhanced AI mode activated', initResult);
      }

      // Получаем текущий статус сервисов
      const status = AIService.getServicesStatus();
      setAiServicesStatus(status);

    } catch (error) {
      console.error('VoiceAssistant: Failed to initialize advanced AI:', error);
      setIsEnhancedMode(false);
    }
  };

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isListening]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

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
        
        // Обновляем статус сервисов если использовались продвинутые возможности
        if (result.enhanced_features) {
          const status = AIService.getServicesStatus();
          setAiServicesStatus(status);
        }
      } else {
        setResponseText('Произошла ошибка при обработке запроса.');
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
      return isEnhancedMode ? 'Демо: AI слушает...' : 'Демо: Слушаю...';
    } else if (isProcessing) {
      return isEnhancedMode ? 'AI обрабатывает...' : 'Обрабатываю запрос...';
    } else if (transcribedText) {
      return 'Готово!';
    }
    return isEnhancedMode ? 'AI помощник готов (Demo)' : 'Нажмите для демо';
  };

  const getStatusIcon = () => {
    if (isListening) {
      return 'mic';
    } else if (isProcessing) {
      return 'reload';
    } else if (transcribedText) {
      return 'checkmark-circle';
    }
    return isEnhancedMode ? 'sparkles' : 'mic-outline';
  };

  const renderAIServicesStatus = () => {
    if (!isEnhancedMode || !aiServicesStatus) return null;

    return (
      <View style={styles.servicesStatus}>
        <Text style={[styles.servicesTitle, { color: theme.colors.textSecondary }]}>
          AI Сервисы:
        </Text>
        
        {/* LiveKit Status */}
        <View style={styles.serviceItem}>
          <View style={[
            styles.serviceIndicator, 
            { backgroundColor: aiServicesStatus.livekit.enabled ? '#4CAF50' : '#757575' }
          ]} />
          <Text style={[styles.serviceText, { color: theme.colors.text }]}>
            LiveKit: {aiServicesStatus.livekit.enabled ? 'Подключен' : 'Отключен'}
          </Text>
        </View>

        {/* FetchAI Status */}
        <View style={styles.serviceItem}>
          <View style={[
            styles.serviceIndicator, 
            { backgroundColor: aiServicesStatus.fetchai.enabled ? '#4CAF50' : '#757575' }
          ]} />
          <Text style={[styles.serviceText, { color: theme.colors.text }]}>
            Fetch.ai: {aiServicesStatus.fetchai.enabled ? 'Активен' : 'Отключен'}
          </Text>
        </View>

        {/* Enhanced Features Badge */}
        {isEnhancedMode && (
          <View style={[styles.enhancedBadge, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="sparkles" size={12} color="white" />
            <Text style={styles.enhancedText}>Enhanced AI</Text>
          </View>
        )}
      </View>
    );
  };

  const renderAdvancedFeatures = () => {
    if (!isEnhancedMode) return null;

    return (
      <View style={styles.advancedFeatures}>
        <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
          Продвинутые возможности:
        </Text>
        
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Ionicons name="headset" size={16} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Real-time голосовой AI
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="analytics" size={16} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Умное планирование маршрутов
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="person" size={16} color={theme.colors.primary} />
            <Text style={[styles.featureText, { color: theme.colors.text }]}>
              Персонализированные рекомендации
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/* Enhanced Floating Voice Button */}
      <TouchableOpacity
        style={[
          styles.voiceButton,
          { 
            backgroundColor: isEnhancedMode ? '#FF6B35' : theme.colors.primary,
            borderWidth: isEnhancedMode ? 2 : 0,
            borderColor: isEnhancedMode ? '#FFD700' : 'transparent'
          }
        ]}
        onPress={handleVoiceButtonPress}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <Ionicons 
            name={getStatusIcon()} 
            size={28} 
            color="white" 
          />
        </Animated.View>
        
        {/* Enhanced Mode Indicator */}
        {isEnhancedMode && (
          <View style={styles.enhancedIndicator}>
            <Ionicons name="sparkles" size={12} color="#FFD700" />
          </View>
        )}
      </TouchableOpacity>

      {/* Enhanced Voice Assistant Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.cardBackground }]}>
              
              {/* Enhanced Header */}
              <View style={styles.modalHeader}>
                <View style={styles.headerLeft}>
                  {isEnhancedMode && (
                    <Ionicons name="sparkles" size={20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                  )}
                  <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                    {isEnhancedMode ? 'AI Гид-Помощник Pro' : 'AI Гид-Помощник'}
                  </Text>
                </View>
                <TouchableOpacity onPress={closeModal}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {/* AI Services Status */}
              {renderAIServicesStatus()}

              {/* Status Section */}
              <View style={styles.statusSection}>
                <Animated.View style={[
                  styles.micContainer,
                  { 
                    backgroundColor: isListening ? 
                      (isEnhancedMode ? '#FF6B35' : theme.colors.primary) : 
                      theme.colors.background,
                    transform: [{ scale: pulseAnim }]
                  }
                ]}>
                  <Ionicons 
                    name={getStatusIcon()} 
                    size={48} 
                    color={isListening ? "white" : theme.colors.primary} 
                  />
                </Animated.View>
                
                <Text style={[styles.statusText, { color: theme.colors.text }]}>
                  {getStatusText()}
                </Text>
              </View>

              {/* Transcribed Text */}
              {transcribedText ? (
                <View style={styles.textSection}>
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
                <View style={styles.textSection}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Ответ AI:
                  </Text>
                  <Text style={[
                    styles.responseText, 
                    { 
                      color: theme.colors.text,
                      backgroundColor: isEnhancedMode ? '#E8F5E8' : '#F0F8F0'
                    }
                  ]}>
                    {responseText}
                  </Text>
                </View>
              ) : null}

              {/* Advanced Features */}
              {renderAdvancedFeatures()}

              {/* Action Buttons */}
              <View style={styles.buttonSection}>
                {!isListening && !isProcessing && (
                  <TouchableOpacity
                    style={[
                      styles.actionButton, 
                      { backgroundColor: isEnhancedMode ? '#FF6B35' : theme.colors.primary }
                    ]}
                    onPress={startListening}
                  >
                    <Ionicons name="mic" size={20} color="white" />
                    <Text style={styles.actionButtonText}>
                      {isEnhancedMode ? 'Новый AI запрос' : 'Повторить запрос'}
                    </Text>
                  </TouchableOpacity>
                )}
                
                {isListening && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#FF6B6B' }]}
                    onPress={stopListening}
                  >
                    <Ionicons name="stop" size={20} color="white" />
                    <Text style={styles.actionButtonText}>
                      Остановить
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Enhanced Help Text */}
              <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
                {isEnhancedMode ? 'Примеры запросов (Enhanced AI Demo):' : 'Примеры запросов (Expo Go Demo):'}{'\n'}
                • "Найди маршрут к Байтереку"{'\n'}
                • "Покажи исторические места рядом"{'\n'}
                • "Красивый маршрут к мечети"{'\n'}
                {isEnhancedMode && '• "Спланируй идеальный день в Астане"'}{'\n'}
                {'\n'}
                📱 В Expo Go голосовой ввод симулируется
              </Text>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  voiceButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  enhancedIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.85,
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  servicesStatus: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  servicesTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  serviceText: {
    fontSize: 12,
  },
  enhancedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  enhancedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  micContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textSection: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  transcribedText: {
    fontSize: 16,
    fontStyle: 'italic',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  responseText: {
    fontSize: 15,
    lineHeight: 22,
    padding: 10,
    borderRadius: 8,
  },
  advancedFeatures: {
    marginBottom: 15,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    marginLeft: 8,
  },
  buttonSection: {
    marginTop: 10,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  helpText: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
}); 