import { ref, push, set } from 'firebase/database';
import { database } from '../database/firebase';

export const addComment = async (requestId: string, uid: string, text: string) => {
  const id = push(ref(database, `comments/${requestId}`)).key!;
  await set(ref(database, `comments/${requestId}/${id}`), {
    id,
    uid,
    text,
    createdAt: Date.now(),
  });
  return id;
};


