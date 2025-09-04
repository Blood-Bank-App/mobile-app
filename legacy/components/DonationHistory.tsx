import React, { useEffect, useState } from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { auth, database } from '../database/firebase';
import { ref, onValue } from 'firebase/database';

type Donation = { id: string; requestId: string; status: string; date: number };
type Request = { id: string; patientName: string; hospital: string };

export default function DonationHistory() {
  const uid = auth.currentUser?.uid;
  const [list, setList] = useState<Donation[]>([]);
  const [reqMap, setReqMap] = useState<Record<string, Request>>({});

  useEffect(() => {
    if (!uid) return;
    const d = ref(database, `donations/${uid}`);
    const off1 = onValue(d, (s) => {
      const arr: Donation[] = [];
      s.forEach((c) => arr.push(c.val()));
      setList(arr.sort((a,b)=>b.date-a.date));
    });
    const r = ref(database, 'requests');
    const off2 = onValue(r, (s) => {
      const m: Record<string, Request> = {};
      s.forEach((c) => { const v = c.val(); m[v.id] = v; });
      setReqMap(m);
    });
    return () => { off1(); off2(); };
  }, [uid]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <StatusBar barStyle="light-content" backgroundColor="#b22222" />
      <FlatList
        data={list}
        keyExtractor={(i)=>i.id}
        renderItem={({ item }) => {
          const r = reqMap[item.requestId];
          return (
            <Card style={{ marginBottom: 12 }}>
              <Card.Content>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{r?.patientName || item.requestId}</Text>
                <Text>Hospital: {r?.hospital || '-'}</Text>
                <Text>Status: {item.status}</Text>
                <Text>Date: {new Date(item.date).toLocaleString()}</Text>
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
}


