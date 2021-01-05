import * as functions from 'firebase-functions';

const apiVersion = functions.config().env.api.version;

const env = functions.config().env;

const momoURL = env.momo.TEST_ENV === 'true' ? 'https://test-payment.momo.vn' : 'https://payment.momo.vn';
const paymentConfig = {
    returnUrl: 'https://dev.elites.work',
    notifyUrl: `https://asia-east2-elites-work-staging.cloudfunctions.net/api/${apiVersion}/payments/momo/ipn`,
    transactionURL: `${momoURL}/gw_payment/transactionProcessor`
};

export { env, apiVersion, paymentConfig };
