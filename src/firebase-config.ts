import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG || '');
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

export { admin };
