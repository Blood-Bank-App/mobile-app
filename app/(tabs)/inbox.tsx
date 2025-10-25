import { Colors } from '@/constants/Colors';
import { useMode } from '@/context/ModeContext';
import { useThemeCustom } from '@/context/ThemeContext';
import { acceptRequest, listDonorInbox, rejectRequest } from '@/lib/requests';
import { BloodRequest } from '@/lib/types';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DonorInboxScreen() {
  const { theme } = useThemeCustom();
  const isDark = theme === 'dark';
  const { mode } = useMode();
  const [activeTab, setActiveTab] = useState<'targeted' | 'discoverable'>('targeted');
  const [targeted, setTargeted] = useState<BloodRequest[]>([]);
  const [discoverable, setDiscoverable] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadInbox = async () => {
    try {
      console.log('🔄 Loading inbox data...');
      const { targeted: t, discoverable: d } = await listDonorInbox();
      setTargeted(t);
      setDiscoverable(d);
      console.log('✅ Inbox loaded:', { targeted: t.length, discoverable: d.length });
    } catch (e) {
      console.error('❌ Failed to load inbox:', e);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInbox();
    setRefreshing(false);
  };

  useEffect(() => {
    if (mode === 'donor') loadInbox();
  }, [mode]);

  const onAccept = async (id: string) => {
    try {
      setLoading(true);
      await acceptRequest(id);
      Alert.alert('Accepted', 'Request accepted successfully.');
      await loadInbox();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to accept request.');
    } finally {
      setLoading(false);
    }
  };

  const onReject = async (id: string) => {
    try {
      setLoading(true);
      await rejectRequest(id);
      Alert.alert('Rejected', 'Request rejected.');
      await loadInbox();
    } catch (e: any) {
      Alert.alert('Error', e?.message ?? 'Failed to reject request.');
    } finally {
      setLoading(false);
    }
  };


  if (mode !== 'donor') {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <Text style={[styles.title, { color: isDark ? '#fff' : Colors[theme].text }]}>Switch to Donor mode to view inbox</Text>
      </View>
    );
  }

  const currentData = activeTab === 'targeted' ? targeted : discoverable;

  return (
    <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[theme].text }]}>Donor Inbox</Text>
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: Colors[theme].cardBackground }]}
          onPress={onRefresh}
          disabled={refreshing}
        >
          <Ionicons 
            name="refresh" 
            size={20} 
            color={refreshing ? Colors[theme].secondaryText : Colors[theme].text}
            style={refreshing ? styles.refreshing : undefined}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'targeted' && styles.tabActive]} 
          onPress={() => setActiveTab('targeted')}
        >
          <Text style={[styles.tabText, activeTab === 'targeted' && styles.tabTextActive]}>
            Request To Me ({targeted.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'discoverable' && styles.tabActive]} 
          onPress={() => setActiveTab('discoverable')}
        >
          <Text style={[styles.tabText, activeTab === 'discoverable' && styles.tabTextActive]}>
            All Requests ({discoverable.length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 12, paddingVertical: 8 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[theme].text}
            colors={[Colors[theme].tint]}
          />
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]}>
            <Text style={[styles.patientName, { color: isDark ? '#fff' : '#111827' }]}>{item.patientName}</Text>
            <Text style={[styles.meta, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>
              {item.requiredBloodGroup} • {item.city} • {item.gender}
            </Text>
            {item.hospital && <Text style={[styles.meta, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{item.hospital}</Text>}
            {item.notes && <Text style={[styles.notes, { color: isDark ? '#D1D5DB' : '#6B7280' }]}>{item.notes}</Text>}
            <Text style={[styles.time, { color: isDark ? '#9CA3AF' : '#9CA3AF' }]}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>

            <View style={styles.actions}>
              {activeTab === 'targeted' ? (
                <>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#10B981' }]} 
                    onPress={() => onAccept(item.id)}
                    disabled={loading}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: '#EF4444' }]} 
                    onPress={() => onReject(item.id)}
                    disabled={loading}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                    <Text style={styles.actionText}>Reject</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: '#3B82F6' }]} 
                  onPress={() => onAccept(item.id)}
                  disabled={loading}
                >
                  <Ionicons name="hand-right" size={16} color="#fff" />
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
              )}
              
              <Link href={{ pathname: '/profile/[uid]', params: { uid: item.createdBy } }} asChild>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#6B7280' }]}>
                  <Ionicons name="person" size={16} color="#fff" />
                  <Text style={styles.actionText}>View Patient</Text>
                </TouchableOpacity>
              </Link>
              
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: Colors[theme].secondaryText }]}>
            {activeTab === 'targeted' ? 'No targeted requests.' : 'No open requests available.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
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
  tabs: { flexDirection: 'row', marginBottom: 16, backgroundColor: '#F3F4F6', borderRadius: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#E11D48', borderRadius: 8 },
  tabText: { fontWeight: '600', color: '#6B7280' },
  tabTextActive: { color: '#fff' },
  card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 8 },
  patientName: { fontSize: 18, fontWeight: '700' },
  meta: { fontSize: 14 },
  notes: { fontSize: 14, fontStyle: 'italic' },
  time: { fontSize: 12, opacity: 0.7 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 8 
  },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 },
});
