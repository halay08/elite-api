import * as functions from 'firebase-functions';

const region = functions.config().env.region || process.env.REGION;
const runtimeOptions = functions.config().env.runtimeOptions || JSON.parse(process.env.RUNTIME_OPTIONS || '{}');

export { region, runtimeOptions };
