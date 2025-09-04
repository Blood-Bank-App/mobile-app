import { listMyDonations } from '@/lib/donations';
import { listMyRequests } from '@/lib/requests';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type HistoryItem = {
  id: string;
  date: number;
  patient?: string;
  hospital?: string;
  status: 'Donated' | 'Pending';
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    (async () => {
      const [donations, myRequests] = await Promise.all([
        listMyDonations(),
        listMyRequests(),
      ]);
      const items: HistoryItem[] = [
        ...donations.map((d) => ({ id: `d_${d.id}`, date: d.date, status: d.status === 'donated' ? 'Donated' : 'Pending' })),
        ...myRequests.map((r) => ({ id: `r_${r.id}`, date: r.createdAt, patient: r.patientName, hospital: r.hospital, status: 'Pending' })),
      ].sort((a, b) => b.date - a.date);
      setHistory(items);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.meta}>{new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.name}>{item.patient ?? 'N/A'}</Text>
            <Text style={styles.meta}>{item.hospital ?? '—'} • {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 14, opacity: 0.7 },
  empty: { textAlign: 'center', marginTop: 24, opacity: 0.6 },
});


