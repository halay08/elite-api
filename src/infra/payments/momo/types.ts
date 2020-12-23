export type MomoCredentials = {
    partnerCode: string;
    accessKey: string;
};
export type MomoFields = {
    requestId: string;
    amount: string;
    orderId: string;
    orderInfo?: string;
    returnUrl: string;
    notifyUrl: string;
    requestType?: string;
    extraData?: string;
};

export type MomoIPNRequest = {
    partnerCode: string;
    accessKey: string;
    requestId: string;
    orderId: string;
    orderInfo: string;
    orderType: string;
    transId: string;
    errorCode: number;
    message: string;
    localMessage: string;
    payType: string;
    responseTime: string;
    extraData: string;
    signature: string;
    amount: string;
};

export type MomoIPNSignature = MomoCredentials & {
    requestId: string;
    orderId: string;
    errorCode: number;
    message: string;
    responseTime: string;
    extraData: string;
};

export type MomoIPNResponse = MomoIPNSignature & { signature: string };

export type MomoWalletResponse = {
    requestId: string;
    errorCode: number;
    orderId: string;
    message: string;
    localMessage: string;
    requestType: string;
    payUrl: string;
    signature: string;
    qrCodeUrl?: string;
    deeplink?: string;
    deeplinkWebInApp?: string;
};

type MomoSignature = { signature?: string };
export type MomoWallet = MomoCredentials & MomoFields & MomoSignature;
