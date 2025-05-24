import * as Speech from 'expo-speech';

// Попытка импорта Voice с fallback на expo-speech
let Voice = null;
let isVoiceAvailable = false;

try {
  Voice = require('@react-native-voice/voice').default;
  isVoiceAvailable = true;
  console.log('AIService: Using @react-native-voice/voice');
} catch (error) {
  console.log('AIService: @react-native-voice/voice not available in Expo Go, using expo-speech fallback');
  isVoiceAvailable = false;
}

import LiveKitService from './LiveKitService';
import FetchAIService from './FetchAIService';
import { calculateDistance, estimateTravelTime } from '../utils/geoUtils';

class AIService {
  constructor() {
    this.isListening = false;
    this.isUsingLiveKit = false;
    this.isUsingFetchAI = false;
    this.isVoiceAvailable = isVoiceAvailable;
    
    if (isVoiceAvailable) {
      this.setupVoiceRecognition();
    } else {
      console.log('AIService: Voice recognition not available, using text-to-speech only mode');
    }
  }

  setupVoiceRecognition() {
    if (!isVoiceAvailable || !Voice) return;
    
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  // Инициализация продвинутых AI сервисов
  async initializeAdvancedServices(config = {}) {
    try {
      console.log('AIService: Initializing advanced AI services...');

      // Инициализация LiveKit если доступен
      if (config.livekit?.enabled) {
        const livekitConfig = LiveKitService.getTestConfiguration ? 
          LiveKitService.getTestConfiguration() : 
          {
            serverUrl: 'wss://mock-tourgid-ai.demo.local',
            roomName: 'tourgid_expo_demo_room',
            participantName: 'expo_tourist_user'
          };
        
        const token = LiveKitService.generateAccessToken ? 
          LiveKitService.generateAccessToken(livekitConfig.roomName, livekitConfig.participantName) :
          `mock_token_${Date.now()}`;
        
        this.isUsingLiveKit = await LiveKitService.initializeRoom(
          config.livekit.serverUrl || livekitConfig.serverUrl,
          token
        );
        
        if (this.isUsingLiveKit) {
          console.log('AIService: LiveKit enabled for real-time voice AI');
        }
      }

      // Инициализация Fetch.ai если доступен
      if (config.fetchai?.enabled && config.fetchai?.apiKey) {
        this.isUsingFetchAI = await FetchAIService.initialize(config.fetchai.apiKey);
        
        if (this.isUsingFetchAI) {
          console.log('AIService: Fetch.ai agents initialized for intelligent routing');
        }
      }

      return {
        livekit: this.isUsingLiveKit,
        fetchai: this.isUsingFetchAI
      };
    } catch (error) {
      console.error('AIService: Failed to initialize advanced services:', error);
      return { livekit: false, fetchai: false };
    }
  }

  onSpeechStart(event) {
    console.log('Speech started:', event);
  }

  onSpeechEnd(event) {
    console.log('Speech ended:', event);
    this.isListening = false;
  }

  onSpeechResults(event) {
    console.log('Speech results:', event.value);
    if (this.onResults) {
      this.onResults(event.value[0]);
    }
  }

  onSpeechError(event) {
    console.log('Speech error:', event.error);
    this.isListening = false;
    if (this.onError) {
      this.onError(event.error);
    }
  }

  async startListening(onResults, onError) {
    try {
      this.onResults = onResults;
      this.onError = onError;

      // Используем LiveKit если доступен, иначе fallback на стандартный Voice
      if (this.isUsingLiveKit) {
        return await this.startLiveKitListening(onResults, onError);
      } else {
        return await this.startStandardListening();
      }
    } catch (error) {
      console.error('Failed to start listening:', error);
      this.isListening = false;
    }
  }

  // Начать запись через LiveKit
  async startLiveKitListening(onResults, onError) {
    try {
      console.log('AIService: Starting LiveKit voice recording...');
      this.isListening = true;

      return await LiveKitService.startVoiceRecording(
        (response) => {
          // LiveKit предоставляет real-time ответ от AI
          if (response.type === 'audio_response') {
            console.log('AIService: Received real-time AI response from LiveKit');
            // Здесь обрабатываем аудио ответ от AI
            this.handleLiveKitAudioResponse(response);
          }
        },
        (status) => {
          console.log('AIService: LiveKit status:', status);
          if (status === 'processing' && onResults) {
            // Для совместимости с текущим UI можем имитировать результат
            onResults('LiveKit processing voice...');
          }
        }
      );
    } catch (error) {
      console.error('AIService: LiveKit listening failed:', error);
      return false;
    }
  }

  // Стандартная запись голоса (fallback)
  async startStandardListening() {
    try {
      if (!isVoiceAvailable || !Voice) {
        // Fallback: симулируем голосовой ввод через текст
        console.log('AIService: Voice input simulation - using text fallback');
        this.isListening = true;
        
        // Через 2 секунды имитируем результат распознавания
        setTimeout(() => {
          if (this.onResults) {
            this.onResults('Найди маршрут к Байтереку'); // Демо фраза
          }
          this.isListening = false;
        }, 2000);
        
        return true;
      }

      this.isListening = true;
      await Voice.start('ru-RU');
      return true;
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.isListening = false;
      return false;
    }
  }

  async stopListening() {
    try {
      if (this.isUsingLiveKit) {
        await LiveKitService.stopVoiceRecording();
      } else if (isVoiceAvailable && Voice) {
        await Voice.stop();
      }
      this.isListening = false;
    } catch (error) {
      console.error('Failed to stop listening:', error);
    }
  }

  // Обработка аудио ответа от LiveKit
  handleLiveKitAudioResponse(response) {
    // В реальной реализации здесь будет воспроизведение аудио
    console.log('AIService: Playing AI audio response from LiveKit');
    // response.track содержит аудио поток от AI
  }

  // Улучшенный Prompt Chaining с интеграцией FetchAI
  async processUserQuery(transcribedText, currentLocation) {
    try {
      // Если FetchAI доступен, используем его для более умного анализа
      if (this.isUsingFetchAI) {
        return await this.processWithFetchAI(transcribedText, currentLocation);
      } else {
        // Fallback на стандартную обработку
        return this.mockNLUResponse(transcribedText);
      }
    } catch (error) {
      console.error('NLU processing failed:', error);
      return { intent: 'unclear', confidence: 0.0 };
    }
  }

  // Обработка через FetchAI агентов
  async processWithFetchAI(transcribedText, currentLocation) {
    try {
      console.log('AIService: Using FetchAI for intelligent query processing...');

      const userRequest = {
        transcribedText,
        currentLocation,
        preferences: this.extractPreferencesFromText(transcribedText),
        userId: 'current_user', // В реальном приложении получаем из контекста
        timestamp: Date.now()
      };

      const fetchAIResult = await FetchAIService.planIntelligentRoute(userRequest);

      if (fetchAIResult.success) {
        return {
          intent: 'get_route',
          destination: fetchAIResult.route?.destination?.name,
          preferences: userRequest.preferences,
          confidence: fetchAIResult.confidence,
          fetchai_route: fetchAIResult.route,
          reasoning: fetchAIResult.reasoning,
          alternatives: fetchAIResult.alternatives
        };
      } else {
        console.warn('AIService: FetchAI failed, falling back to mock response');
        return this.mockNLUResponse(transcribedText);
      }
    } catch (error) {
      console.error('AIService: FetchAI processing failed:', error);
      return this.mockNLUResponse(transcribedText);
    }
  }

  // Извлечение предпочтений из текста (улучшенная версия)
  extractPreferencesFromText(text) {
    const lowerText = text.toLowerCase();
    const preferences = [];

    // Расширенный список предпочтений
    const preferenceMap = {
      'красив': 'scenic',
      'живопис': 'scenic', 
      'красот': 'scenic',
      'вид': 'scenic',
      'истор': 'historical',
      'культур': 'cultural',
      'музей': 'cultural',
      'галере': 'cultural',
      'быстр': 'short',
      'корот': 'short',
      'скор': 'short',
      'длинн': 'long',
      'подробн': 'long',
      'толп': 'avoid_crowds',
      'народ': 'avoid_crowds',
      'тих': 'quiet',
      'спокойн': 'quiet',
      'активн': 'active',
      'спорт': 'active',
      'еда': 'food',
      'ресторан': 'food',
      'кафе': 'food',
      'покупк': 'shopping',
      'магазин': 'shopping',
      'природ': 'nature',
      'парк': 'nature'
    };

    Object.entries(preferenceMap).forEach(([keyword, preference]) => {
      if (lowerText.includes(keyword) && !preferences.includes(preference)) {
        preferences.push(preference);
      }
    });

    return preferences;
  }

  // Улучшенная генерация маршрута с FetchAI интеграцией
  async generateRoute(nluResult, currentLocation, attractionsData) {
    if (nluResult.intent !== 'get_route') {
      return null;
    }

    try {
      // Если у нас есть результат от FetchAI, используем его
      if (nluResult.fetchai_route) {
        return this.adaptFetchAIRouteToStandardFormat(nluResult.fetchai_route, currentLocation);
      }

      // Иначе используем стандартную логику
      return await this.generateStandardRoute(nluResult, currentLocation, attractionsData);
    } catch (error) {
      console.error('Route generation failed:', error);
      return null;
    }
  }

  // Адаптация FetchAI маршрута к стандартному формату
  adaptFetchAIRouteToStandardFormat(fetchaiRoute, currentLocation) {
    return {
      destination: fetchaiRoute.destination || fetchaiRoute.waypoints?.[fetchaiRoute.waypoints.length - 1],
      route: {
        start: currentLocation,
        end: fetchaiRoute.destination?.coordinates,
        waypoints: fetchaiRoute.waypoints || [],
        preferences: fetchaiRoute.preferences || [],
        estimated_duration: fetchaiRoute.estimated_duration,
        estimated_distance: fetchaiRoute.estimated_distance,
        difficulty_level: fetchaiRoute.difficulty_level,
        highlights: fetchaiRoute.highlights
      },
      reasoning: fetchaiRoute.reasoning,
      alternatives: fetchaiRoute.alternatives
    };
  }

  // Стандартная генерация маршрута (fallback)
  async generateStandardRoute(nluResult, currentLocation, attractionsData) {
    let targetAttraction = null;
    
    if (nluResult.destination) {
      targetAttraction = attractionsData.find(attr => 
        attr.name.toLowerCase().includes(nluResult.destination.toLowerCase())
      );
    }

    if (!targetAttraction && nluResult.preferences.length > 0) {
      targetAttraction = attractionsData.find(attr =>
        nluResult.preferences.some(pref => attr.categories?.includes(pref))
      );
    }

    if (!targetAttraction) {
      targetAttraction = attractionsData[0];
    }

    // Расчет расстояния и времени
    const distance = currentLocation && targetAttraction.coordinates ? 
      calculateDistance(
        currentLocation.latitude, currentLocation.longitude,
        targetAttraction.coordinates.latitude, targetAttraction.coordinates.longitude
      ) : 0;

    const estimatedTime = estimateTravelTime(distance, 'walking');

    return {
      destination: targetAttraction,
      route: {
        start: currentLocation,
        end: targetAttraction.coordinates,
        waypoints: [],
        preferences: nluResult.preferences,
        estimated_duration: estimatedTime,
        estimated_distance: distance
      }
    };
  }

  // Улучшенная генерация ответа с учетом FetchAI
  async generateResponse(routeData, nluResult) {
    try {
      if (!routeData) {
        return "Извините, я не смог понять ваш запрос. Попробуйте сказать что-то вроде 'Найди маршрут к Байтереку' или 'Покажи исторические места рядом'.";
      }

      const { destination, route } = routeData;
      let response = `Отлично! Я нашел маршрут к ${destination.name}.`;

      // Добавляем информацию о расстоянии и времени
      if (route.estimated_distance) {
        response += ` Расстояние: ${route.estimated_distance.toFixed(1)} км.`;
      }
      if (route.estimated_duration) {
        response += ` Примерное время в пути: ${Math.round(route.estimated_duration)} минут.`;
      }

      // Добавляем информацию о предпочтениях
      if (nluResult.preferences.includes('scenic')) {
        response += " Этот маршрут проходит через живописные места.";
      }
      if (nluResult.preferences.includes('historical')) {
        response += " По пути вы увидите исторически значимые объекты.";
      }
      if (nluResult.preferences.includes('short')) {
        response += " Я выбрал кратчайший путь для вас.";
      }

      // Добавляем описание места назначения
      if (destination.description) {
        response += ` ${destination.name} - ${destination.description}`;
      }

      // Добавляем рассуждения от FetchAI если есть
      if (routeData.reasoning && routeData.reasoning.length > 0) {
        response += ` Почему этот маршрут: ${routeData.reasoning.join(', ')}.`;
      }

      // Упоминаем альтернативы если есть
      if (routeData.alternatives && routeData.alternatives.length > 0) {
        response += ` У меня также есть ${routeData.alternatives.length} альтернативных варианта.`;
      }

      response += " Маршрут отображается на карте. Приятного путешествия!";

      return response;
    } catch (error) {
      console.error('Response generation failed:', error);
      return "Произошла ошибка при обработке запроса.";
    }
  }

  // Улучшенный TTS с LiveKit интеграцией
  async speakResponse(text) {
    try {
      // Если LiveKit доступен, отправляем текст для обработки AI голосом
      if (this.isUsingLiveKit) {
        await LiveKitService.sendTextMessage(text);
        console.log('AIService: Sent response to LiveKit for AI voice synthesis');
      } else {
        // Fallback на стандартный TTS
        await Speech.speak(text, {
          language: 'ru-RU',
          pitch: 1.0,
          rate: 0.9,
          quality: Speech.VoiceQuality.Enhanced
        });
      }
    } catch (error) {
      console.error('TTS failed:', error);
    }
  }

  // Основной метод с расширенными возможностями
  async processVoiceQuery(transcribedText, currentLocation, attractionsData, onRouteGenerated) {
    try {
      console.log('AIService: Starting advanced prompt chaining for:', transcribedText);

      // Step 1: Enhanced NLU (with FetchAI if available)
      const nluResult = await this.processUserQuery(transcribedText, currentLocation);
      console.log('AIService: NLU Result:', nluResult);

      // Step 2: Enhanced Route Generation
      const routeData = await this.generateRoute(nluResult, currentLocation, attractionsData);
      console.log('AIService: Route Data:', routeData);

      // Step 3: Enhanced NLG
      const responseText = await this.generateResponse(routeData, nluResult);
      console.log('AIService: Generated Response:', responseText);

      // Step 4: Enhanced TTS (with LiveKit if available)
      await this.speakResponse(responseText);

      // Callback для обновления UI
      if (onRouteGenerated && routeData) {
        onRouteGenerated(routeData);
      }

      return {
        success: true,
        nluResult,
        routeData,
        responseText,
        enhanced_features: {
          livekit_used: this.isUsingLiveKit,
          fetchai_used: this.isUsingFetchAI,
          confidence: nluResult.confidence || 0.8
        }
      };
    } catch (error) {
      console.error('Voice query processing failed:', error);
      await this.speakResponse("Произошла ошибка при обработке запроса.");
      return { success: false, error };
    }
  }

  // Mock NLU для демо (обновленная версия)
  mockNLUResponse(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('маршрут') || lowerText.includes('дорог') || lowerText.includes('как добраться')) {
      let destination = null;
      const preferences = this.extractPreferencesFromText(text);

      // Расширенный список распознавания мест
      const destinations = {
        'байтерек': 'Байтерек',
        'хан шатыр': 'Хан Шатыр', 
        'акорда': 'Акорда',
        'мечеть': 'Мечеть Нур-Астана',
        'музей': 'Национальный музей',
        'площад': 'Площадь Независимости',
        'парк': 'Центральный парк'
      };

      Object.entries(destinations).forEach(([keyword, place]) => {
        if (lowerText.includes(keyword)) {
          destination = place;
        }
      });

      return {
        intent: 'get_route',
        destination,
        preferences,
        confidence: 0.8
      };
    }

    return { intent: 'unclear', confidence: 0.3 };
  }

  // Получение статуса продвинутых сервисов
  getServicesStatus() {
    return {
      livekit: {
        enabled: this.isUsingLiveKit,
        status: this.isUsingLiveKit ? LiveKitService.getConnectionState() : 'disabled'
      },
      fetchai: {
        enabled: this.isUsingFetchAI,
        statistics: this.isUsingFetchAI ? FetchAIService.getAgentStatistics() : null
      }
    };
  }

  // Отключение всех сервисов
  async destroy() {
    try {
      if (isVoiceAvailable && Voice) {
        await Voice.destroy();
      }
      
      if (this.isUsingLiveKit) {
        await LiveKitService.disconnect();
      }
      
      if (this.isUsingFetchAI) {
        await FetchAIService.shutdown();
      }
      
      console.log('AIService: All services destroyed');
    } catch (error) {
      console.error('Failed to destroy AI services:', error);
    }
  }
}

export default new AIService(); 