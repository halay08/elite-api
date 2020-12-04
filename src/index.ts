require('dotenv').config();

import './firebase.config';

import TYPES from './types';
import * as functions from 'firebase-functions';
import Container from './container';

import { IServer } from '@/api/http/server';

const region = functions.config().env.region;

let APIFunction;

try {
    const server = Container.get<IServer>(TYPES.Server);
    APIFunction = functions.region(region).https.onRequest(server.start());
} catch (e) {
    if (e instanceof Error) functions.logger.log(e.message);
    else throw e;
}

exports.api = APIFunction;
