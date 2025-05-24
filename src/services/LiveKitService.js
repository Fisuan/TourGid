import { Room, RoomEvent, ConnectionState, RemoteParticipant, RemoteTrackPublication, Track } from '@livekit/react-native';
import { Platform } from 'react-native';

class LiveKitService {
  constructor() {
    this.room = null;
    this.isConnected = false;
    this.isRecording = false;
    this.onResponseCallback = null;
    this.onStatusCallback = null;
  }

  // Инициализация LiveKit комнаты для AI-агента
  async initializeRoom(serverUrl, token) {
    try {
      this.room = new Room();
      
      // Настройка событий
      this.room.on(RoomEvent.Connected, this.onConnected.bind(this));
      this.room.on(RoomEvent.Disconnected, this.onDisconnected.bind(this));
      this.room.on(RoomEvent.TrackSubscribed, this.onTrackSubscribed.bind(this));
      this.room.on(RoomEvent.ParticipantConnected, this.onParticipantConnected.bind(this));

      // Подключение к LiveKit серверу
      await this.room.connect(serverUrl, token);
      
      console.log('LiveKit: Connected to room');
      return true;
    } catch (error) {
      console.error('LiveKit: Failed to connect:', error);
      return false;
    }
  }

  onConnected() {
    console.log('LiveKit: Room connected');
    this.isConnected = true;
    if (this.onStatusCallback) {
      this.onStatusCallback('connected');
    }
  }

  onDisconnected() {
    console.log('LiveKit: Room disconnected');
    this.isConnected = false;
    if (this.onStatusCallback) {
      this.onStatusCallback('disconnected');
    }
  }

  onParticipantConnected(participant) {
    console.log('LiveKit: AI Participant connected:', participant.identity);
    if (this.onStatusCallback) {
      this.onStatusCallback('ai_ready');
    }
  }

  onTrackSubscribed(track, publication, participant) {
    console.log('LiveKit: Track subscribed:', track.kind);
    
    if (track.kind === Track.Kind.Audio && participant.identity === 'tour_guide_ai') {
      // Получили аудио ответ от AI
      if (this.onResponseCallback) {
        this.onResponseCallback({
          type: 'audio_response',
          track: track,
          participant: participant
        });
      }
    }
  }

  // Начать запись голосового запроса пользователя
  async startVoiceRecording(onResponse, onStatus) {
    try {
      this.onResponseCallback = onResponse;
      this.onStatusCallback = onStatus;

      if (!this.isConnected) {
        throw new Error('LiveKit room not connected');
      }

      // Включаем микрофон и начинаем передачу аудио в комнату
      await this.room.localParticipant.setMicrophoneEnabled(true);
      this.isRecording = true;

      if (onStatus) {
        onStatus('recording');
      }

      console.log('LiveKit: Started voice recording');
      return true;
    } catch (error) {
      console.error('LiveKit: Failed to start recording:', error);
      return false;
    }
  }

  // Остановить запись и получить ответ от AI
  async stopVoiceRecording() {
    try {
      if (!this.isRecording) {
        return false;
      }

      // Отключаем микрофон, сигнализируя AI что запрос завершен
      await this.room.localParticipant.setMicrophoneEnabled(false);
      this.isRecording = false;

      if (this.onStatusCallback) {
        this.onStatusCallback('processing');
      }

      console.log('LiveKit: Stopped voice recording, waiting for AI response');
      return true;
    } catch (error) {
      console.error('LiveKit: Failed to stop recording:', error);
      return false;
    }
  }

  // Отправить текстовое сообщение AI (fallback)
  async sendTextMessage(message) {
    try {
      if (!this.isConnected) {
        throw new Error('LiveKit room not connected');
      }

      // Отправляем текстовое сообщение через data channel
      const data = JSON.stringify({
        type: 'text_query',
        message: message,
        timestamp: Date.now()
      });

      await this.room.localParticipant.publishData(data, {
        reliable: true,
        destinationSids: [] // Отправить всем
      });

      console.log('LiveKit: Sent text message to AI');
      return true;
    } catch (error) {
      console.error('LiveKit: Failed to send text message:', error);
      return false;
    }
  }

  // Получить состояние соединения
  getConnectionState() {
    if (!this.room) return 'not_initialized';
    
    switch (this.room.state) {
      case ConnectionState.Connected:
        return 'connected';
      case ConnectionState.Connecting:
        return 'connecting';
      case ConnectionState.Disconnected:
        return 'disconnected';
      case ConnectionState.Reconnecting:
        return 'reconnecting';
      default:
        return 'unknown';
    }
  }

  // Отключиться от комнаты
  async disconnect() {
    try {
      if (this.room) {
        await this.room.disconnect();
        this.room = null;
      }
      this.isConnected = false;
      this.isRecording = false;
      console.log('LiveKit: Disconnected from room');
    } catch (error) {
      console.error('LiveKit: Failed to disconnect:', error);
    }
  }

  // Настройка качества аудио для туристического контента
  configureAudioSettings() {
    const audioSettings = {
      // Высокое качество для четкого голоса гида
      audioBitrate: 64000,
      // Подавление шума для уличных условий
      noiseSuppression: true,
      // Автоматическая регулировка громкости
      autoGainControl: true,
      // Подавление эха
      echoCancellation: true
    };

    return audioSettings;
  }

  // Создать токен доступа (в реальном проекте должно быть на бэкенде)
  static generateAccessToken(roomName, participantName) {
    // Это mock - в продакшене токен должен генерироваться на сервере
    const mockToken = `mock_token_${roomName}_${participantName}_${Date.now()}`;
    console.warn('LiveKit: Using mock token - implement server-side token generation for production');
    return mockToken;
  }

  // Конфигурация для тестирования (можно использовать LiveKit Cloud)
  static getTestConfiguration() {
    return {
      serverUrl: 'wss://tourgid-ai.livekit.cloud', // Замените на ваш URL
      roomName: 'tourgid_ai_room',
      participantName: 'tourist_user',
      aiParticipantName: 'tour_guide_ai'
    };
  }
}

export default new LiveKitService(); 