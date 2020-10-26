import * as functions from 'firebase-functions';

const apiVersion = functions.config().env.api.version;

const env = functions.config().env;

const USER_ROLES = ['admin', 'student', 'tutor'];

export { env, apiVersion, USER_ROLES };
