import * as functions from 'firebase-functions';

const apiVersion = functions.config().env.api.version;

export { apiVersion };
