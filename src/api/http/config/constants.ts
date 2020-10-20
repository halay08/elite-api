import * as functions from 'firebase-functions';

const apiVersion = functions.config().env.api.version;

const USER_ROLES = ['admin', 'student', 'tutor'];

export { apiVersion, USER_ROLES };
