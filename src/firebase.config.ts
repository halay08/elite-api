import * as admin from 'firebase-admin';

if (process.env.NODE_ENV === 'development') {
    admin.initializeApp();

    const db = admin.firestore();
    db.settings({
        host: 'localhost:8080',
        ssl: false
    });
} else {
    const serviceAccount = require('./serviceAccountKey.json');
    const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '');
    adminConfig.credential = admin.credential.cert(serviceAccount);
    admin.initializeApp(adminConfig);
}

export { admin };
