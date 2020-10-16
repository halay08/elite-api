import { admin } from '@/src/firebase-config';

const db = admin.firestore();

if (process.env.NODE_ENV === 'develop') {
    db.settings({
        host: 'localhost:8080',
        ssl: false
    });
}

export default db;

