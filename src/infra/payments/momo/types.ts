export type Signature = {
    partnerCode: string;
    accessKey: string;
    requestId: string;
    amount: number;
    orderId: string;
    orderInfo?: string;
    returnUrl?: string;
    notifyUrl?: string;
    extraData?: string;
};
