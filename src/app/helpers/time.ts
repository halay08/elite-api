import { admin } from '@/src/firebase.config';

/**
 * Get current UTC date
 */
export const getCurrentUTCDate = (): Date => {
    return admin.firestore.Timestamp.now().toDate();
};

/**
 *
 * @param date Add more day
 * @param days
 */
export const addDate = (date?: Date, days: number = 1): Date => {
    if (!date) {
        // eslint-disable-next-line no-param-reassign
        date = getCurrentUTCDate();
    }
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};
