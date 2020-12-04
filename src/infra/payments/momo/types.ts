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
