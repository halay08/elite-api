import { IPaymentHandler, IPaymentRequestHandler } from './paymentHandlerInterface';

export abstract class AbstractHandler<T> implements IPaymentHandler {
    private nextHandler: IPaymentHandler;

    public setNext(handler: IPaymentHandler): IPaymentHandler {
        this.nextHandler = handler;
        return handler;
    }

    public async handle(request: IPaymentRequestHandler<T>): Promise<T> {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }

        return Promise.resolve(null as any);
    }
}
