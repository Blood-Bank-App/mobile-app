import { ref, push, set } from 'firebase/database';
import { database } from '../database/firebase';

export const postRequest = async (uid: string, payload: any) => {
  const id = push(ref(database, 'requests')).key!;
  await set(ref(database, `requests/${id}`), {
    id,
    createdBy: uid,
    status: 'open',
    createdAt: Date.now(),
    ...payload,
  });
  return id;
};


