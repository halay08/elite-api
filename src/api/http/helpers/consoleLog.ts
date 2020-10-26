import * as functions from 'firebase-functions';

export default function (msg: any) {
    functions.logger.info(msg, { structuredData: true });
}
