import { ref, set, push } from 'firebase/database';
import { database } from '../database/firebase';

export const recordDonationIntent = async (uid: string, requestId: string) => {
  const id = push(ref(database, `donations/${uid}`)).key!;
  await set(ref(database, `donations/${uid}/${id}`), {
    id,
    requestId,
    status: 'pending',
    date: Date.now(),
  });
  return id;
};


