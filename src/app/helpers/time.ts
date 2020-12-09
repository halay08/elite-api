import { admin } from '@/src/firebase.config';
import * as dayjs from 'dayjs';

type ITime = {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    second: number;
};

/**
 * Get current UTC date
 */
const getCurrentUTCDate = (): Date => {
    return admin.firestore.Timestamp.now().toDate();
};

/**
 * @param date Add more day
 * @param days
 */
const addDate = (date?: Date, days: number = 1): Date => {
    if (!date) {
        // eslint-disable-next-line no-param-reassign
        date = getCurrentUTCDate();
    }
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
};

const getCustomTime = (time?: Partial<ITime>): Date => {
    const utcTime = getCurrentUTCDate();
    return dayjs()
        .set('year', time?.year || utcTime.getFullYear())
        .set('month', time?.month || utcTime.getDate() + 1)
        .set('date', time?.date || utcTime.getDate())
        .set('hour', time?.hour || utcTime.getHours())
        .set('minute', time?.minute || utcTime.getMinutes())
        .set('second', time?.second || utcTime.getSeconds())
        .toDate();
};

export { ITime, getCurrentUTCDate, addDate, getCustomTime };
