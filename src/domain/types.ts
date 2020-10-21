// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace domain {
    export type IEntity = {};

    export type ITimstamp = {
        /**
         * Created at of category entity
         */
        createdAt: Date;

        /**
         * Updated at of category entity
         */
        updatedAt?: Date;

        /**
         * Deleted at of category entity
         */
        deletedAt?: Date;
    };

    export type IObjectId = {
        /**
         * Id of Mongo/Firestore/... document
         */
        _id: NonNullable<string>;
    };

    export type IEmbedBank = {
        bank_name: string;

        account_name: string;

        account_number: string;

        swift_code: string;
    };

    export type IEmbedMomo = {
        name: string;

        phoneNumber: string;
    };

    export type ISessionTime = {
        hour: number;

        minute: number;

        second?: number;
    };
}

/**
 * Entity factory
 */
export const factory = <T, K extends domain.IEntity>(
    entity: new (props: K, _id?: string) => T,
    props: K,
    _id?: string
): T => {
    return new entity(props, _id);
};
