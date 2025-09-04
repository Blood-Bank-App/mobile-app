import { recordDonationIntent } from '@/lib/donations';
import { getRequestById } from '@/lib/requests';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RequestDetail = {
  id: string;
  patientName: string;
  requiredBloodGroup: string;
  city: string;
  hospital?: string;
  unitsRequired?: number;
  notes?: string;
};

export default function RequestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [request, setRequest] = useState<RequestDetail | null>(null);

  useEffect(() => {
    (async () => {
      if (typeof id !== 'string') return;
      const r = await getRequestById(id);
      if (!r) {
        setRequest(null);
        return;
      }
      setRequest({
        id: r.id,
        patientName: r.patientName,
        requiredBloodGroup: r.requiredBloodGroup,
        city: r.city,
        hospital: r.hospital,
        unitsRequired: r.unitsRequired,
        notes: r.notes,
      });
    })();
  }, [id]);

  const donate = async () => {
    if (!id) return;
    await recordDonationIntent(id);
  };

  if (!request) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Request</Text>
        <Text style={{ opacity: 0.6 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{request.patientName}</Text>
      <Text style={styles.meta}>{request.requiredBloodGroup} • {request.city}</Text>
      <Text style={styles.meta}>{request.hospital ?? '—'} • {request.unitsRequired ?? 0} units</Text>
      <Text style={{ marginTop: 8 }}>{request.notes ?? ''}</Text>
      <TouchableOpacity style={styles.primaryButton} onPress={donate}>
        <Text style={styles.primaryText}>I Can Donate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  meta: { fontSize: 14, opacity: 0.7 },
  primaryButton: {
    marginTop: 12,
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
});


