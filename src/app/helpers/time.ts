import { admin } from '@/src/firebase.config';

export const getCurrentUTCDate = (): Date => {
    return admin.firestore.Timestamp.now().toDate();
};
