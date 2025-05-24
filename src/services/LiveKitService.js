// Mock implementation для демо режима (Expo Go совместимость)
// В продакшене создать development build с реальными нативными модулями

import { Platform } from 'react-native';

// Mock классы для имитации LiveKit SDK - только для демо
class MockRoom {
  constructor() {
    this.state = 'disconnected';
    this.localParticipant = {
      setMicrophoneEnabled: async (enabled) => {
        console.log('MockRoom: Microphone', enabled ? 'enabled' : 'disabled');
        return true;
      },
      publishData: async (data, options) => {
        console.log('MockRoom: Data published:', data);
        return true;
      }
    };
    this.callbacks = {};
  }

  on(event, callback) {
    this.callbacks[event] = callback;
  }

  async connect(serverUrl, token) {
    console.log('MockRoom: Connecting to', serverUrl);
    this.state = 'connected';
    
    // Имитируем успешное подключение
    setTimeout(() => {
      if (this.callbacks['Connected']) {
        this.callbacks['Connected']();
      }
      
      // Имитируем подключение AI участника
      setTimeout(() => {
        if (this.callbacks['ParticipantConnected']) {
          this.callbacks['ParticipantConnected']({ identity: 'tour_guide_ai' });
        }
      }, 1000);
    }, 500);
    
    return true;
  }

  async disconnect() {
    console.log('MockRoom: Disconnecting');
    this.state = 'disconnected';
    if (this.callbacks['Disconnected']) {
      this.callbacks['Disconnected']();
    }
  }
}

// Mock константы для LiveKit API
const RoomEvent = {
  Connected: 'Connected',
  Disconnected: 'Disconnected',
  TrackSubscribed: 'TrackSubscribed',
  ParticipantConnected: 'ParticipantConnected'
};

const ConnectionState = {
  Connected: 'connected',
  Connecting: 'connecting',
  Disconnected: 'disconnected',
  Reconnecting: 'reconnecting'
};

const Track = {
  Kind: {
    Audio: 'audio',
    Video: 'video'
  }
};

// Используем только Mock классы (Expo Go режим)
const Room = MockRoom;

class LiveKitService {
  constructor() {
    this.room = null;
    this.isConnected = false;
    this.isRecording = false;
    this.onResponseCallback = null;
    this.onStatusCallback = null;
    this.isMockMode = true; // Всегда true для Expo Go
    
    console.log('LiveKitService: Running in Expo Go mock mode');
  }

  // Инициализация Mock комнаты для демо
  async initializeRoom(serverUrl, token) {
    try {
      this.room = new Room();
      
      // Настройка событий
      this.room.on(RoomEvent.Connected, this.onConnected.bind(this));
      this.room.on(RoomEvent.Disconnected, this.onDisconnected.bind(this));
      this.room.on(RoomEvent.TrackSubscribed, this.onTrackSubscribed.bind(this));
      this.room.on(RoomEvent.ParticipantConnected, this.onParticipantConnected.bind(this));

      // Подключение к Mock серверу
      await this.room.connect(serverUrl, token);
      
      console.log('LiveKitService: Mock room connected');
      return true;
    } catch (error) {
      console.error('LiveKitService: Failed to connect mock room:', error);
      return false;
    }
  }

  onConnected() {
    console.log('LiveKitService: Mock room connected');
    this.isConnected = true;
    if (this.onStatusCallback) {
      this.onStatusCallback('connected');
    }
  }

  onDisconnected() {
    console.log('LiveKitService: Mock room disconnected');
    this.isConnected = false;
    if (this.onStatusCallback) {
      this.onStatusCallback('disconnected');
    }
  }

  onParticipantConnected(participant) {
    console.log('LiveKitService: Mock AI Participant connected:', participant.identity);
    if (this.onStatusCallback) {
      this.onStatusCallback('ai_ready');
    }
  }

  onTrackSubscribed(track, publication, participant) {
    console.log('LiveKitService: Mock track subscribed:', track.kind);
    
    if (track.kind === Track.Kind.Audio && participant.identity === 'tour_guide_ai') {
      // Имитируем получение аудио ответа от AI
      if (this.onResponseCallback) {
        this.onResponseCallback({
          type: 'audio_response',
          track: track,
          participant: participant
        });
      }
    }
  }

  // Mock запись голоса (для демо)
  async startVoiceRecording(onResponse, onStatus) {
    try {
      this.onResponseCallback = onResponse;
      this.onStatusCallback = onStatus;

      if (!this.isConnected) {
        throw new Error('Mock LiveKit room not connected');
      }

      // Имитируем включение микрофона
      await this.room.localParticipant.setMicrophoneEnabled(true);
      this.isRecording = true;

      if (onStatus) {
        onStatus('recording');
      }

      console.log('LiveKitService: Started mock voice recording');
      return true;
    } catch (error) {
      console.error('LiveKitService: Failed to start mock recording:', error);
      return false;
    }
  }

  // Mock остановка записи
  async stopVoiceRecording() {
    try {
      if (!this.isRecording) {
        return false;
      }

      // Имитируем отключение микрофона
      await this.room.localParticipant.setMicrophoneEnabled(false);
      this.isRecording = false;

      if (this.onStatusCallback) {
        this.onStatusCallback('processing');
      }

      console.log('LiveKitService: Stopped mock voice recording');
      return true;
    } catch (error) {
      console.error('LiveKitService: Failed to stop mock recording:', error);
      return false;
    }
  }

  // Mock отправка текста
  async sendTextMessage(message) {
    try {
      if (!this.isConnected) {
        throw new Error('Mock LiveKit room not connected');
      }

      // Имитируем отправку данных
      const data = JSON.stringify({
        type: 'text_query',
        message: message,
        timestamp: Date.now()
      });

      await this.room.localParticipant.publishData(data, {
        reliable: true,
        destinationSids: []
      });

      console.log('LiveKitService: Sent mock text message to AI');
      return true;
    } catch (error) {
      console.error('LiveKitService: Failed to send mock text message:', error);
      return false;
    }
  }

  // Mock состояние соединения
  getConnectionState() {
    if (!this.room) return 'not_initialized';
    
    switch (this.room.state) {
      case 'connected':
        return 'connected';
      case 'connecting':
        return 'connecting';
      case 'disconnected':
        return 'disconnected';
      case 'reconnecting':
        return 'reconnecting';
      default:
        return 'unknown';
    }
  }

  // Mock отключение
  async disconnect() {
    try {
      if (this.room) {
        await this.room.disconnect();
        this.room = null;
      }
      this.isConnected = false;
      this.isRecording = false;
      console.log('LiveKitService: Mock room disconnected');
    } catch (error) {
      console.error('LiveKitService: Failed to disconnect mock room:', error);
    }
  }

  // Mock настройки аудио
  configureAudioSettings() {
    const audioSettings = {
      audioBitrate: 64000,
      noiseSuppression: true,
      autoGainControl: true,
      echoCancellation: true
    };

    console.log('LiveKitService: Mock audio settings configured');
    return audioSettings;
  }

  // Mock генерация токена
  static generateAccessToken(roomName, participantName) {
    const mockToken = `expo_mock_token_${roomName}_${participantName}_${Date.now()}`;
    console.log('LiveKitService: Generated mock token for Expo Go demo');
    return mockToken;
  }

  // Mock конфигурация для демо
  static getTestConfiguration() {
    return {
      serverUrl: 'wss://mock-tourgid-ai.demo.local',
      roomName: 'tourgid_expo_demo_room',
      participantName: 'expo_tourist_user',
      aiParticipantName: 'mock_tour_guide_ai'
    };
  }
}

export default new LiveKitService(); 