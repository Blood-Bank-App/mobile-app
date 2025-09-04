import React, { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { Button, Surface, Text, TextInput, Card } from 'react-native-paper';
import { ref, onValue } from 'firebase/database';
import { database, auth } from '../database/firebase';
import { addComment } from '../lib/comments';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';

type RequestDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RequestDetail'>;
type RequestDetailRouteProp = RouteProp<RootStackParamList, 'RequestDetail'>;

type Props = {
  navigation: RequestDetailNavigationProp;
  route: RequestDetailRouteProp;
};

type Request = {
  id: string;
  patientName: string;
  bloodGroup: string;
  city: string;
  gender: string;
  hospital: string;
  units: number;
  neededBy: string;
  notes: string;
  createdBy: string;
  status: string;
};

export default function RequestDetail({ route }: Props) {
  const { id } = route.params as any;
  const [req, setReq] = useState<Request | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const r = ref(database, 'requests/' + id);
    const off1 = onValue(r, (s) => setReq(s.val()));
    const c = ref(database, `comments/${id}`);
    const off2 = onValue(c, (s) => {
      const arr: any[] = [];
      s.forEach((child) => arr.push(child.val()));
      setComments(arr.sort((a,b)=>a.createdAt-b.createdAt));
    });
    return () => { off1(); off2(); };
  }, [id]);

  const submit = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !text.trim()) return;
    await addComment(id, uid, text.trim());
    setText('');
  };

  if (!req) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#b22222" />

      <View style={{
        height: '20%',
        backgroundColor: '#b22222',
        borderBottomLeftRadius: 70,
        justifyContent: 'center',
        paddingLeft: 30
      }}>
        <Text style={{ color: '#fff', fontSize: 34, fontWeight: 'bold' }}>Request Detail</Text>
      </View>

      <Surface style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <Card style={{ marginBottom: 16 }}>
            <Card.Content>
              <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{req.patientName} - {req.bloodGroup}</Text>
              <Text>City: {req.city}</Text>
              <Text>Gender: {req.gender}</Text>
              <Text>Hospital: {req.hospital}</Text>
              <Text>Units: {req.units}</Text>
              <Text>Needed By: {req.neededBy}</Text>
              <Text>Notes: {req.notes}</Text>
            </Card.Content>
          </Card>

          <Button mode="contained" style={{ backgroundColor: '#b22222', borderRadius: 12, marginBottom: 16 }}>I Can Donate</Button>

          <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>Comments</Text>
          {comments.map((c) => (
            <Card key={c.id} style={{ marginBottom: 10 }}>
              <Card.Content>
                <Text>{c.text}</Text>
                <Text style={{ color: '#777', fontSize: 12 }}>{new Date(c.createdAt).toLocaleString()}</Text>
              </Card.Content>
            </Card>
          ))}

          <TextInput
            label="Write a comment…"
            mode="outlined"
            value={text}
            onChangeText={setText}
            style={{ marginTop: 8, marginBottom: 8 }}
          />
          <Button mode="contained" onPress={submit} style={{ backgroundColor: '#b22222', borderRadius: 12 }}>Post</Button>
        </ScrollView>
      </Surface>
    </View>
  );
}


