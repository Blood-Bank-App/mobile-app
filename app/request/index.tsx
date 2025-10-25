import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BloodRequest } from '@/lib/types';
import { RequestAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RequestListScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const isDark = colorScheme === 'dark';
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [tab, setTab] = useState<'to_me' | 'all'>('to_me');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      console.log('🔄 Loading requests...');
      setLoading(true);
      const requestsData = await RequestAPI.listRequests();
      setRequests(requestsData.sort((a: BloodRequest, b: BloodRequest) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      console.log('✅ Requests loaded:', requestsData.length, 'items');
    } catch (error) {
      console.error('❌ Error loading requests:', error);
      Alert.alert('Error', 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  // For now, we'll show all requests in 'to_me' tab since we need to implement proper user ID extraction from JWT
  // TODO: Extract user ID from JWT token for proper filtering
  const filtered = requests.filter((r) => {
    if (tab === 'to_me') {
      // Show open requests and requests that might be relevant to current user
      return r.status !== 'fulfilled' && r.status !== 'cancelled';
    }
    return true;
  });

  const onAccept = async (id: string) => {
    try {
      await RequestAPI.acceptRequest(id);
      Alert.alert('Accepted', 'You have accepted this request.');
      loadRequests(); // Reload requests
    } catch (e: any) {
      Alert.alert('Failed', e?.message ?? 'Could not accept.');
    }
  };

  const onReject = async (id: string) => {
    try {
      await RequestAPI.rejectRequest(id);
      Alert.alert('Rejected', 'You have rejected this request.');
      loadRequests(); // Reload requests
    } catch (e: any) {
      Alert.alert('Failed', e?.message ?? 'Could not reject.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }] }>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#fff' : Colors[colorScheme].text }]}>Patient Requests</Text>
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: Colors[colorScheme].cardBackground }]}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={refreshing ? Colors[colorScheme].secondaryText : Colors[colorScheme].text}
            style={refreshing ? styles.refreshing : undefined}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabs}>
        {(['to_me','all'] as const).map((k) => (
          <TouchableOpacity key={k} style={[styles.tab, tab===k && styles.tabActive]} onPress={() => setTab(k)}>
            <Text style={[styles.tabText, tab===k && styles.tabTextActive]}>{k === 'to_me' ? 'REQUEST TO ME' : 'ALL REQUESTS'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E11D48" />
          <Text style={[styles.loadingText, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>Loading requests...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors[colorScheme].text}
              colors={[Colors[colorScheme].tint]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Link href={`/request/${item.id}`} asChild>
                <TouchableOpacity>
                  <Text style={[styles.name, { color: isDark ? '#fff' : '#111827' }]}>{item.patientName} • {item.requiredBloodGroup}</Text>
                  <Text style={[styles.meta, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{item.city} • {item.hospital ?? '—'}</Text>
                  <Text style={[styles.meta, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>Status: {item.status}</Text>
                </TouchableOpacity>
              </Link>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                {(item.status === 'open' || item.status === 'pending') && (
                  <>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => onAccept(item.id)}>
                      <Text style={styles.primaryText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => onReject(item.id)}>
                      <Text style={styles.secondaryText}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                <Link href={`/donations/add`} asChild>
                  <TouchableOpacity style={styles.darkButton}>
                    <Text style={styles.darkText}>Donate Amount</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24, opacity: 0.6, color: isDark ? '#D1D5DB' : '#6B7280' }}>No requests</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  title: { fontSize: 24, fontWeight: '700' },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  refreshing: {
    transform: [{ rotate: '180deg' }],
  },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  tabActive: { backgroundColor: '#111827' },
  tabText: { color: '#111827', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 16 
  },
  loadingText: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, gap: 4 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 14, opacity: 0.7 },
  primaryButton: { backgroundColor: '#E11D48', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondaryButton: { borderColor: '#E11D48', borderWidth: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  secondaryText: { color: '#E11D48', fontWeight: '600' },
  darkButton: { backgroundColor: '#111827', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  darkText: { color: '#fff', fontWeight: '600' },
});


