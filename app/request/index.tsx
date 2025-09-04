import { database } from '@/database/firebase';
import { BloodRequest } from '@/lib/types';
import { Link } from 'expo-router';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RequestListScreen() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');

  useEffect(() => {
    (async () => {
      const snap = await get(ref(database, 'requests'));
      if (snap.exists()) {
        const list = Object.values(snap.val()) as BloodRequest[];
        setRequests(list.sort((a, b) => b.createdAt - a.createdAt));
      } else {
        setRequests([]);
      }
    })();
  }, []);

  const filtered = requests.filter((r) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return r.status === 'open' || r.status === 'pending';
    return r.status === statusFilter;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request History</Text>
      <View style={styles.tabs}>
        {(['all','pending','accepted','rejected'] as const).map((k) => (
          <TouchableOpacity key={k} style={[styles.tab, statusFilter===k && styles.tabActive]} onPress={() => setStatusFilter(k)}>
            <Text style={[styles.tabText, statusFilter===k && styles.tabTextActive]}>{k.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <Link href={`/request/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.name}>{item.patientName} • {item.requiredBloodGroup}</Text>
              <Text style={styles.meta}>{item.city} • {item.hospital ?? '—'}</Text>
              <Text style={styles.meta}>Status: {item.status}</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 24, opacity: 0.6 }}>No requests</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  tabs: { flexDirection: 'row', gap: 8, marginTop: 8, marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  tabActive: { backgroundColor: '#111827' },
  tabText: { color: '#111827', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, gap: 4 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 14, opacity: 0.7 },
});


