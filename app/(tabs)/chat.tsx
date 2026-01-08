import { Colors } from '@/constants/Colors';
import { useThemeCustom } from '@/context/ThemeContext';
import { ChatAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: number;
  attachments?: any[];
};

type ChatSession = {
  id: string;
  uid: string;
  createdAt: string | number; // Backend returns datetime string
  updatedAt: string | number;
};

export default function ChatScreen() {
  const { theme } = useThemeCustom();
  const isDark = theme === 'dark';
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession]);

  const loadSessions = async () => {
    try {
      console.log('🔄 Loading chat sessions...');
      setLoading(true);
      const sessionsData = await ChatAPI.listSessions();
      console.log('📊 Sessions data:', sessionsData);
      
      // Sort sessions by updatedAt (most recent first)
      const sortedSessions = [...sessionsData].sort((a, b) => {
        const timeA = typeof a.updatedAt === 'string' ? new Date(a.updatedAt).getTime() : (a.updatedAt || 0);
        const timeB = typeof b.updatedAt === 'string' ? new Date(b.updatedAt).getTime() : (b.updatedAt || 0);
        return timeB - timeA; // Most recent first
      });
      
      setSessions(sortedSessions);
      console.log('✅ Chat sessions loaded:', sortedSessions.length, 'sessions');
      
      // Auto-select most recent session if none selected or if current session is not in the list
      if (sortedSessions.length > 0) {
        const currentSessionId = currentSession?.id;
        const sessionStillExists = currentSessionId && sortedSessions.some(s => s.id === currentSessionId);
        
        if (!currentSession || !sessionStillExists) {
          console.log('🎯 Auto-selecting most recent session:', sortedSessions[0].id);
          setCurrentSession(sortedSessions[0]);
        }
      }
    } catch (error) {
      console.error('❌ Failed to load chat sessions:', error);
      Alert.alert('Error', 'Failed to load chat sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      console.log('🔄 Loading messages for session:', sessionId);
      const messagesData = await ChatAPI.getSessionMessages(sessionId);
      console.log('📊 Messages data:', messagesData);
      
      // Convert backend message format to frontend format
      const convertedMessages = messagesData.map((msg: any) => {
        console.log('🔄 Converting message:', msg);
        return {
          id: msg.id,
          content: msg.content,
          sender: msg.role === 'assistant' ? 'ai' : 'user',
          timestamp: new Date(msg.createdAt).getTime(),
          attachments: msg.attachments
        };
      });
      
      console.log('📊 Converted messages:', convertedMessages);
      
      setMessages(convertedMessages);
      console.log('✅ Messages loaded:', convertedMessages.length, 'messages');
    } catch (error) {
      console.error('❌ Failed to load messages:', error);
      Alert.alert('Error', 'Failed to load messages');
    }
  };

  const createNewSession = async () => {
    try {
      console.log('🔄 Creating new chat session...');
      const newSession = await ChatAPI.createSession();
      // Add new session to the beginning of the list
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      console.log('✅ New chat session created');
    } catch (error) {
      console.error('❌ Failed to create session:', error);
      Alert.alert('Error', 'Failed to create new chat session');
      // Reload sessions to ensure we have the latest list
      await loadSessions();
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentSession || sending) return;

    const messageText = inputText.trim();
    setInputText('');
    setSending(true);

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      content: messageText,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      console.log('🔄 Sending message:', messageText);
      const response = await ChatAPI.sendMessage(currentSession.id, messageText);
      console.log('📊 Send message response:', response);
      
      // Add AI response
      const aiMessage: ChatMessage = {
        id: response.id || `ai_${Date.now()}`,
        content: response.content || 'I received your message. How can I help you?',
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Refresh sessions to update the updatedAt timestamp
      await loadSessions();
      
      console.log('✅ Message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message');
      
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return (
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={[
          styles.messageBubble,
          { 
            backgroundColor: item.sender === 'user' 
              ? '#E11D48' 
              : isDark ? '#374151' : '#F3F4F6'
          }
        ]}>
          <Text style={[
            styles.messageText,
            { 
              color: item.sender === 'user' 
                ? '#fff' 
                : isDark ? '#fff' : '#111827'
            }
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isDark ? '#9CA3AF' : '#6B7280' }
          ]}>
            {new Date(item.timestamp).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderSession = ({ item }: { item: ChatSession }) => {
    const isActive = currentSession?.id === item.id;
    const createdAt = typeof item.createdAt === 'string' ? new Date(item.createdAt) : new Date(item.createdAt || Date.now());
    const updatedAt = typeof item.updatedAt === 'string' ? new Date(item.updatedAt) : new Date(item.updatedAt || item.createdAt || Date.now());
    const isToday = updatedAt.toDateString() === new Date().toDateString();
    
    return (
      <TouchableOpacity
        style={[
          styles.sessionItem,
          { 
            backgroundColor: isActive 
              ? '#E11D48' 
              : isDark ? '#111827' : '#fff',
            borderColor: isActive 
              ? '#E11D48' 
              : isDark ? '#374151' : '#e5e7eb',
            borderWidth: isActive ? 2 : 1
          }
        ]}
        onPress={() => setCurrentSession(item)}
      >
        <View style={styles.sessionIcon}>
          <Ionicons 
            name={isActive ? "chatbubble" : "chatbubble-outline"} 
            size={20} 
            color={isActive ? '#fff' : '#E11D48'} 
          />
        </View>
        <View style={styles.sessionInfo}>
          <Text style={[
            styles.sessionTitle,
            { 
              color: isActive 
                ? '#fff' 
                : isDark ? '#fff' : '#111827'
            }
          ]}>
            Chat Session
          </Text>
          <Text style={[
            styles.sessionTime,
            { 
              color: isActive 
                ? 'rgba(255,255,255,0.8)' 
                : isDark ? '#9CA3AF' : '#6B7280'
            }
          ]}>
            {isToday 
              ? `Today ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : updatedAt.toLocaleDateString([], { month: 'short', day: 'numeric' })
            }
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : Colors[theme].text }]}>
          AI Chat Support
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity 
            style={[styles.newChatButton, { backgroundColor: isDark ? '#374151' : '#F3F4F6' }]}
            onPress={loadSessions}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color={isDark ? '#fff' : '#111827'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.newChatButton, { backgroundColor: '#E11D48' }]}
            onPress={createNewSession}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Sessions List */}
        <View style={styles.sessionsContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : Colors[theme].text }]}>
              Chat Sessions {sessions.length > 0 && `(${sessions.length})`}
            </Text>
          </View>
          {sessions.length === 0 ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text style={[styles.emptySessionsText, { color: isDark ? '#9CA3AF' : '#6B7280' }]}>
                No previous sessions. Create a new one to start chatting!
              </Text>
            </View>
          ) : (
            <FlatList
              data={sessions}
              keyExtractor={(item) => item.id}
              renderItem={renderSession}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
            />
          )}
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
                Loading chat sessions...
              </Text>
            </View>
          ) : currentSession ? (
            <KeyboardAvoidingView 
              style={styles.messagesView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, gap: 12 }}
              >
                {messages.map((message) => (
                  <View key={message.id} style={[
                    styles.messageContainer,
                    message.sender === 'user' ? styles.userMessage : styles.aiMessage
                  ]}>
                    <View style={[
                      styles.messageBubble,
                      { 
                        backgroundColor: message.sender === 'user' 
                          ? '#E11D48' 
                          : isDark ? '#374151' : '#F3F4F6'
                      }
                    ]}>
                      <Text style={[
                        styles.messageText,
                        { 
                          color: message.sender === 'user' 
                            ? '#fff' 
                            : isDark ? '#fff' : '#111827'
                        }
                      ]}>
                        {message.content}
                      </Text>
                      <Text style={[
                        styles.messageTime,
                        { color: isDark ? '#9CA3AF' : '#6B7280' }
                      ]}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              
              {/* Input */}
              <View style={[
                styles.inputContainer,
                { 
                  backgroundColor: isDark ? '#111827' : '#fff',
                  borderColor: isDark ? '#374151' : '#e5e7eb'
                }
              ]}>
                <TextInput
                  style={[
                    styles.textInput,
                    { 
                      color: isDark ? '#fff' : '#111827',
                      backgroundColor: isDark ? '#111827' : '#fff'
                    }
                  ]}
                  placeholder="Type your message..."
                  placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={1000}
                />
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    { 
                      backgroundColor: inputText.trim() && !sending ? '#E11D48' : '#9CA3AF'
                    }
                  ]}
                  onPress={sendMessage}
                  disabled={!inputText.trim() || sending}
                >
                  <Ionicons 
                    name="send" 
                    size={20} 
                    color="#fff" 
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          ) : (
            <View style={styles.noSession}>
              <Ionicons name="chatbubbles-outline" size={64} color={isDark ? '#6B7280' : '#9CA3AF'} />
              <Text style={[styles.noSessionText, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
                Select a chat session or create a new one
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  title: { fontSize: 24, fontWeight: '700' },
  newChatButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36,
    minHeight: 36
  },
  content: { flex: 1 },
  sessionsContainer: { 
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12, 
    paddingHorizontal: 16 
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 200
  },
  sessionIcon: { marginRight: 12 },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontSize: 14, fontWeight: '600' },
  sessionTime: { fontSize: 12, marginTop: 2 },
  messagesContainer: { flex: 1 },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 32 
  },
  loadingText: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  messagesView: { flex: 1 },
  messageContainer: { marginVertical: 4 },
  userMessage: { alignItems: 'flex-end' },
  aiMessage: { alignItems: 'flex-start' },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: { fontSize: 16, lineHeight: 20 },
  messageTime: { fontSize: 12, marginTop: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    gap: 12
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16
  },
  sendButton: {
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyMessages: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 16
  },
  emptyText: { fontSize: 16, textAlign: 'center' },
  noSession: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  noSessionText: { fontSize: 16, textAlign: 'center' },
  emptySessionsText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic'
  }
});
