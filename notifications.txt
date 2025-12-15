import { Colors } from '@/constants/Colors';
import { useThemeCustom } from '@/context/ThemeContext';
import { NotificationAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: number;
};

export default function NotificationsScreen() {
  const { theme } = useThemeCustom();
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [unreadOnly]);

  const loadNotifications = async () => {
    try {
      console.log('🔄 Loading notifications...');
      setLoading(true);
      const notificationsData = await NotificationAPI.listNotifications(unreadOnly);
      setNotifications(notificationsData);
      console.log('✅ Notifications loaded:', notificationsData.length, 'items');
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
      Alert.alert('Error', 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationAPI.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      console.log('✅ All notifications marked as read');
      Alert.alert('Success', 'All notifications marked as read');
    } catch (error) {
      console.error('❌ Failed to mark all notifications as read:', error);
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request':
        return 'medkit';
      case 'donation':
        return 'heart';
      case 'system':
        return 'information-circle';
      case 'urgent':
        return 'warning';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return '#EF4444';
      case 'request':
        return '#E11D48';
      case 'donation':
        return '#10B981';
      case 'system':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        { 
          backgroundColor: isDark ? '#111827' : '#fff',
          borderColor: isDark ? '#374151' : '#e5e7eb',
          opacity: item.read ? 0.7 : 1
        }
      ]}
      onPress={() => !item.read && markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={[
          styles.iconContainer,
          { backgroundColor: getNotificationColor(item.type) + '20' }
        ]}>
          <Ionicons 
            name={getNotificationIcon(item.type) as any} 
            size={20} 
            color={getNotificationColor(item.type)} 
          />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[
            styles.notificationTitle,
            { 
              color: isDark ? '#fff' : '#111827',
              fontWeight: item.read ? '400' : '600'
            }
          ]}>
            {item.title}
          </Text>
          <Text style={[
            styles.notificationMessage,
            { color: isDark ? '#D1D5DB' : '#6B7280' }
          ]}>
            {item.message}
          </Text>
        </View>
        <View style={styles.notificationMeta}>
          {!item.read && (
            <View style={[styles.unreadDot, { backgroundColor: '#E11D48' }]} />
          )}
          <Text style={[
            styles.notificationTime,
            { color: isDark ? '#9CA3AF' : '#9CA3AF' }
          ]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : Colors[theme].text }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={[styles.markAllButton, { backgroundColor: '#E11D48' }]}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { 
              backgroundColor: unreadOnly ? '#E11D48' : 'transparent',
              borderColor: '#E11D48'
            }
          ]}
          onPress={() => setUnreadOnly(!unreadOnly)}
        >
          <Ionicons 
            name="mail-unread" 
            size={16} 
            color={unreadOnly ? '#fff' : '#E11D48'} 
          />
          <Text style={[
            styles.filterText,
            { color: unreadOnly ? '#fff' : '#E11D48' }
          ]}>
            Unread Only ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[theme].text}
            colors={[Colors[theme].tint]}
          />
        }
        renderItem={renderNotification}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="notifications-outline" 
              size={64} 
              color={isDark ? '#6B7280' : '#9CA3AF'} 
            />
            <Text style={[styles.emptyText, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              {unreadOnly ? 'No unread notifications' : 'No notifications yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: isDark ? '#6B7280' : '#9CA3AF' }]}>
              You'll receive notifications for blood requests, donations, and important updates
            </Text>
          </View>
        }
      />
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
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6
  },
  markAllText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  filters: { 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 6
  },
  filterText: { fontWeight: '600', fontSize: 14 },
  notificationCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationContent: { flex: 1 },
  notificationTitle: { fontSize: 16, marginBottom: 4 },
  notificationMessage: { fontSize: 14, lineHeight: 18 },
  notificationMeta: {
    alignItems: 'flex-end',
    gap: 4
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  notificationTime: { fontSize: 12 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 64,
    gap: 16
  },
  emptyText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptySubtext: { fontSize: 14, textAlign: 'center', lineHeight: 20 }
});
