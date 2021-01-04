import * as functions from 'firebase-functions';

export const everySecond = functions.pubsub.schedule('* * * * *').onRun(async () => {
    // your code here
});
