import { database } from '@/database/firebase';
import { get, push, ref, set } from 'firebase/database';
import { Comment } from './types';

export async function addComment(requestId: string, uid: string, text: string): Promise<string> {
  const id = push(ref(database, `comments/${requestId}`)).key!;
  const data: Comment = {
    id,
    uid,
    text,
    createdAt: Date.now(),
  };
  await set(ref(database, `comments/${requestId}/${id}`), data);
  return id;
}

export async function listComments(requestId: string): Promise<Comment[]> {
  const snap = await get(ref(database, `comments/${requestId}`));
  if (!snap.exists()) return [];
  return Object.values(snap.val());
}


