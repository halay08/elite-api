require('dotenv').config()

// eslint-disable-next-line import/no-unassigned-import
import './firebase.config';
import * as functions from 'firebase-functions';

import { IServer } from '@/api/http/server';

import Container from './container';
// import { nextApp } from './frontend/functions';
import TYPES from './types';

const region = functions.config().env.region;

try {
    const server = Container.get<IServer>(TYPES.Server);
    exports.api = functions.region(region).https.onRequest(server.start());
} catch (e) {
    if (e instanceof Error) console.log(e.message);
    else throw e;
}
