import { io, Socket } from 'socket.io-client';
import { tokenManager } from './api';

// Socket.IO Configuration
const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:8000';

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;

  // Event listeners
  private eventListeners: Map<string, Function[]> = new Map();

  async connect(): Promise<void> {
    try {
      const token = await tokenManager.getAccessToken();
      if (!token) {
        console.warn('No access token available for socket connection');
        return;
      }

      this.socket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        timeout: 20000,
      });

      this.setupEventListeners();
      
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connected', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('disconnected', { reason });
      
      // Attempt to reconnect
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, this.reconnectInterval);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection_error', { error: error.message });
    });

    // Custom event listeners
    this.socket.on('notification', (data) => {
      console.log('Received notification:', data);
      this.emit('notification', data);
    });

    this.socket.on('request_notification', (data) => {
      console.log('Received request notification:', data);
      this.emit('request_notification', data);
    });

    this.socket.on('request_status_update', (data) => {
      console.log('Request status update:', data);
      this.emit('request_status_update', data);
    });

    this.socket.on('donor_availability_update', (data) => {
      console.log('Donor availability update:', data);
      this.emit('donor_availability_update', data);
    });

    this.socket.on('new_chat_message', (data) => {
      console.log('New chat message:', data);
      this.emit('new_chat_message', data);
    });

    this.socket.on('ai_response', (data) => {
      console.log('AI response:', data);
      this.emit('ai_response', data);
    });

    this.socket.on('joined_room', (data) => {
      console.log('Joined room:', data);
      this.emit('joined_room', data);
    });

    this.socket.on('left_room', (data) => {
      console.log('Left room:', data);
      this.emit('left_room', data);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.emit('socket_error', data);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Room management
  async joinRoom(room: string): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', { room });
    }
  }

  async leaveRoom(room: string): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', { room });
    }
  }

  // Chat functionality
  async sendChatMessage(sessionId: string, content: string): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_chat_message', {
        session_id: sessionId,
        content: content,
      });
    }
  }

  // Request updates
  async sendRequestUpdate(requestId: string, status: string): Promise<void> {
    if (this.socket && this.isConnected) {
      this.socket.emit('request_update', {
        request_id: requestId,
        status: status,
      });
    }
  }

  // Event subscription system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }

  // Reconnect with new token
  async reconnectWithNewToken(): Promise<void> {
    this.disconnect();
    await this.connect();
  }
}

// Create singleton instance
export const socketService = new SocketService();

// Convenience functions for common operations
export const socketUtils = {
  // Join request-specific room
  async joinRequestRoom(requestId: string): Promise<void> {
    await socketService.joinRoom(`request_${requestId}`);
  },

  // Leave request-specific room
  async leaveRequestRoom(requestId: string): Promise<void> {
    await socketService.leaveRoom(`request_${requestId}`);
  },

  // Join chat session room
  async joinChatRoom(sessionId: string): Promise<void> {
    await socketService.joinRoom(`chat_${sessionId}`);
  },

  // Leave chat session room
  async leaveChatRoom(sessionId: string): Promise<void> {
    await socketService.leaveRoom(`chat_${sessionId}`);
  },

  // Join donors room for availability updates
  async joinDonorsRoom(): Promise<void> {
    await socketService.joinRoom('donors');
  },

  // Leave donors room
  async leaveDonorsRoom(): Promise<void> {
    await socketService.leaveRoom('donors');
  },
};

export default socketService;
