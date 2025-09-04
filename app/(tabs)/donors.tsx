import { listAvailableDonors } from '@/lib/users';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Donor = {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  gender?: string;
  available?: boolean;
};

export default function DonorsScreen() {
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    (async () => {
      const profiles = await listAvailableDonors();
      setDonors(
        profiles.map((p) => ({
          id: p.uid,
          name: p.name,
          bloodGroup: p.bloodGroup ?? '-',
          city: p.city ?? '-',
          gender: p.gender,
          available: p.available,
        }))
      );
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donors</Text>
      <FlatList
        data={donors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.bloodGroup} • {item.city}</Text>
            <TouchableOpacity style={styles.contactButton}>
              <Text style={styles.contactText}>Contact</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No donors yet.</Text>}
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
  contactButton: {
    marginTop: 8,
    backgroundColor: '#E11D48',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 24, opacity: 0.6 },
});


