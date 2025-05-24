import { Agent, Context, Protocol, Model } from 'fetch-ai-sdk';
import { calculateDistance } from '../utils/geoUtils'; // Создадим позже

class FetchAIService {
  constructor() {
    this.routePlannerAgent = null;
    this.poiSearchAgent = null;
    this.userPreferenceAgent = null;
    this.isInitialized = false;
  }

  // Инициализация Fetch.ai агентов
  async initialize(apiKey) {
    try {
      console.log('FetchAI: Initializing agents...');

      // Главный агент для планирования маршрутов
      this.routePlannerAgent = new Agent({
        name: 'route_planner',
        seed: 'tourgid_route_planner_v1',
        mailbox: {
          key: apiKey
        }
      });

      // Агент для поиска точек интереса
      this.poiSearchAgent = new Agent({
        name: 'poi_search',
        seed: 'tourgid_poi_search_v1',
        mailbox: {
          key: apiKey
        }
      });

      // Агент для анализа предпочтений пользователя
      this.userPreferenceAgent = new Agent({
        name: 'user_preference',
        seed: 'tourgid_preference_v1',
        mailbox: {
          key: apiKey
        }
      });

      // Настройка протоколов взаимодействия между агентами
      await this.setupAgentProtocols();

      this.isInitialized = true;
      console.log('FetchAI: Agents initialized successfully');
      return true;
    } catch (error) {
      console.error('FetchAI: Failed to initialize agents:', error);
      return false;
    }
  }

  // Настройка протоколов взаимодействия между агентами
  async setupAgentProtocols() {
    // Протокол для координации между агентами
    const coordinationProtocol = Protocol({
      name: 'route_coordination',
      version: '1.0.0'
    });

    // Модель для обработки запросов маршрутов
    const routeRequestModel = Model({
      route_request: {
        user_location: 'object',
        destination: 'string',
        preferences: 'array',
        constraints: 'object'
      }
    });

    // Регистрируем протоколы у агентов
    await this.routePlannerAgent.include(coordinationProtocol, routeRequestModel);
    await this.poiSearchAgent.include(coordinationProtocol, routeRequestModel);
    await this.userPreferenceAgent.include(coordinationProtocol, routeRequestModel);
  }

  // Умное планирование маршрута с использованием агентов
  async planIntelligentRoute(userRequest) {
    try {
      if (!this.isInitialized) {
        throw new Error('FetchAI agents not initialized');
      }

      console.log('FetchAI: Starting intelligent route planning...');

      // Шаг 1: Анализ предпочтений пользователя
      const userAnalysis = await this.analyzeUserPreferences(userRequest);

      // Шаг 2: Поиск релевантных POI
      const relevantPOIs = await this.findRelevantPOIs(userRequest, userAnalysis);

      // Шаг 3: Оптимизация маршрута
      const optimizedRoute = await this.optimizeRoute(userRequest, relevantPOIs, userAnalysis);

      return {
        success: true,
        route: optimizedRoute,
        reasoning: this.generateRoutingReasoning(userAnalysis, relevantPOIs, optimizedRoute),
        confidence: this.calculateRouteConfidence(optimizedRoute),
        alternatives: await this.generateAlternativeRoutes(userRequest, relevantPOIs)
      };
    } catch (error) {
      console.error('FetchAI: Route planning failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Анализ предпочтений пользователя через AI агента
  async analyzeUserPreferences(userRequest) {
    const context = new Context({
      user_query: userRequest.transcribedText,
      location: userRequest.currentLocation,
      time_of_day: new Date().getHours(),
      day_of_week: new Date().getDay()
    });

    // Отправляем запрос агенту анализа предпочтений
    const response = await this.userPreferenceAgent.send_message(
      'analyze_preferences',
      {
        query: userRequest.transcribedText,
        context: context,
        historical_preferences: await this.getUserHistoricalPreferences(userRequest.userId)
      }
    );

    return {
      interests: response.interests || [],
      activity_level: response.activity_level || 'moderate',
      time_preference: response.time_preference || 'flexible',
      group_size: response.group_size || 1,
      budget_level: response.budget_level || 'medium',
      accessibility_needs: response.accessibility_needs || [],
      mood: response.mood || 'explorative'
    };
  }

  // Поиск релевантных точек интереса
  async findRelevantPOIs(userRequest, userAnalysis) {
    const searchContext = {
      location: userRequest.currentLocation,
      radius: userRequest.searchRadius || 5000, // 5km по умолчанию
      interests: userAnalysis.interests,
      preferences: userRequest.preferences,
      time_constraints: userRequest.timeConstraints
    };

    const response = await this.poiSearchAgent.send_message(
      'search_poi',
      searchContext
    );

    // Фильтруем и ранжируем POI по релевантности
    return this.rankPOIsByRelevance(response.pois, userAnalysis);
  }

  // Оптимизация маршрута через главный агент
  async optimizeRoute(userRequest, relevantPOIs, userAnalysis) {
    const routeContext = {
      start_location: userRequest.currentLocation,
      destination: userRequest.destination,
      waypoints: relevantPOIs.slice(0, 5), // Максимум 5 промежуточных точек
      preferences: userAnalysis,
      constraints: {
        max_duration: userRequest.maxDuration || 240, // 4 часа по умолчанию
        transport_mode: userRequest.transportMode || 'walking',
        avoid_crowds: userAnalysis.interests.includes('avoid_crowds')
      }
    };

    const response = await this.routePlannerAgent.send_message(
      'optimize_route',
      routeContext
    );

    return {
      waypoints: response.optimized_waypoints,
      estimated_duration: response.estimated_duration,
      estimated_distance: response.estimated_distance,
      difficulty_level: response.difficulty_level,
      highlights: response.route_highlights,
      warnings: response.warnings || []
    };
  }

  // Ранжирование POI по релевантности
  rankPOIsByRelevance(pois, userAnalysis) {
    return pois.map(poi => {
      let relevanceScore = 0;

      // Соответствие интересам пользователя
      const interestMatch = userAnalysis.interests.filter(interest => 
        poi.categories.includes(interest)
      ).length;
      relevanceScore += interestMatch * 10;

      // Учет времени дня и дня недели
      if (poi.opening_hours) {
        const isOpen = this.isPOIOpen(poi.opening_hours);
        relevanceScore += isOpen ? 5 : -10;
      }

      // Популярность и рейтинги
      relevanceScore += (poi.rating || 0) * 2;

      // Уникальность (для избежания туристических ловушек)
      if (userAnalysis.interests.includes('avoid_crowds')) {
        relevanceScore -= (poi.popularity_score || 0);
      }

      return {
        ...poi,
        relevance_score: relevanceScore
      };
    }).sort((a, b) => b.relevance_score - a.relevance_score);
  }

  // Генерация объяснения логики маршрута
  generateRoutingReasoning(userAnalysis, relevantPOIs, optimizedRoute) {
    const reasons = [];

    if (userAnalysis.interests.includes('historical')) {
      reasons.push('Маршрут включает исторически значимые места');
    }

    if (userAnalysis.interests.includes('scenic')) {
      reasons.push('Выбраны живописные пути и видовые точки');
    }

    if (userAnalysis.activity_level === 'low') {
      reasons.push('Маршрут адаптирован для спокойного темпа');
    }

    if (optimizedRoute.waypoints.length > 2) {
      reasons.push(`Добавлены ${optimizedRoute.waypoints.length - 2} интересные остановки по пути`);
    }

    return reasons;
  }

  // Расчет уверенности в предложенном маршруте
  calculateRouteConfidence(optimizedRoute) {
    let confidence = 0.5; // Базовая уверенность

    // Увеличиваем уверенность на основе различных факторов
    if (optimizedRoute.waypoints.length >= 3) confidence += 0.2;
    if (optimizedRoute.difficulty_level === 'easy') confidence += 0.1;
    if (optimizedRoute.warnings.length === 0) confidence += 0.1;
    if (optimizedRoute.estimated_duration > 60) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // Генерация альтернативных маршрутов
  async generateAlternativeRoutes(userRequest, relevantPOIs) {
    // Создаем 2-3 альтернативных варианта с разными фокусами
    const alternatives = [];

    // Быстрый маршрут
    if (userRequest.preferences.includes('short')) {
      alternatives.push({
        type: 'quick',
        description: 'Быстрый маршрут к цели',
        estimated_duration: 30
      });
    }

    // Подробный маршрут
    alternatives.push({
      type: 'comprehensive',
      description: 'Подробный осмотр с дополнительными остановками',
      estimated_duration: 180
    });

    // Тематический маршрут
    if (relevantPOIs.length > 3) {
      alternatives.push({
        type: 'thematic',
        description: 'Тематический маршрут по интересам',
        estimated_duration: 120
      });
    }

    return alternatives;
  }

  // Получение исторических предпочтений пользователя
  async getUserHistoricalPreferences(userId) {
    // В реальном приложении здесь будет запрос к базе данных
    // Пока возвращаем заглушку
    return {
      favorite_categories: ['historical', 'cultural'],
      average_visit_duration: 45,
      preferred_time: 'morning',
      feedback_history: []
    };
  }

  // Проверка работает ли POI в данное время
  isPOIOpen(openingHours) {
    // Упрощенная проверка - в реальности нужна более сложная логика
    const currentHour = new Date().getHours();
    return currentHour >= 9 && currentHour <= 18;
  }

  // Обучение агентов на основе фидбека пользователя
  async trainFromFeedback(routeId, userFeedback) {
    try {
      const trainingData = {
        route_id: routeId,
        user_rating: userFeedback.rating,
        comments: userFeedback.comments,
        what_worked: userFeedback.liked,
        what_didnt_work: userFeedback.disliked,
        suggestions: userFeedback.suggestions
      };

      // Отправляем данные всем агентам для обучения
      await Promise.all([
        this.routePlannerAgent.send_message('learn_from_feedback', trainingData),
        this.poiSearchAgent.send_message('learn_from_feedback', trainingData),
        this.userPreferenceAgent.send_message('learn_from_feedback', trainingData)
      ]);

      console.log('FetchAI: Agents trained from user feedback');
      return true;
    } catch (error) {
      console.error('FetchAI: Failed to train from feedback:', error);
      return false;
    }
  }

  // Получение статистики работы агентов
  getAgentStatistics() {
    return {
      route_planner: {
        requests_processed: this.routePlannerAgent?.stats?.requests || 0,
        success_rate: this.routePlannerAgent?.stats?.success_rate || 0,
        average_response_time: this.routePlannerAgent?.stats?.avg_response_time || 0
      },
      poi_search: {
        searches_performed: this.poiSearchAgent?.stats?.searches || 0,
        pois_found: this.poiSearchAgent?.stats?.pois_found || 0,
        relevance_score: this.poiSearchAgent?.stats?.avg_relevance || 0
      },
      user_preference: {
        profiles_analyzed: this.userPreferenceAgent?.stats?.profiles || 0,
        accuracy_rate: this.userPreferenceAgent?.stats?.accuracy || 0,
        learning_progress: this.userPreferenceAgent?.stats?.learning_rate || 0
      }
    };
  }

  // Отключение агентов
  async shutdown() {
    try {
      if (this.routePlannerAgent) await this.routePlannerAgent.stop();
      if (this.poiSearchAgent) await this.poiSearchAgent.stop();
      if (this.userPreferenceAgent) await this.userPreferenceAgent.stop();
      
      this.isInitialized = false;
      console.log('FetchAI: All agents shut down');
    } catch (error) {
      console.error('FetchAI: Error during shutdown:', error);
    }
  }
}

export default new FetchAIService(); 