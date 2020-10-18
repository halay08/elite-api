import * as functions from 'firebase-functions';

const apiVersion = functions.config().env.api.version;

const env = functions.config().env;

export { env, apiVersion };
