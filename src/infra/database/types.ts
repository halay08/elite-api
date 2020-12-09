import { IFirestoreQuery } from './firestore/types';

type IOrderBy<T> = {
    field: keyof T | keyof T[];

    order: 'desc' | 'asc';
};

type IOperatorQuery<T, K> = {
    [K in keyof T]?: any;
} & {
    operator?: K;
};

type IQuery<T> = IOperatorQuery<T, any>;

type IQueryOption<T> = {
    withTrashed: boolean;

    limit: number;

    startAt: number;

    orderBy: IOrderBy<T>;
};

// Firebase types
type IDocumentReference = FirebaseFirestore.DocumentReference;

type IDocumentData = FirebaseFirestore.DocumentData;

type IDocumentSnapshot<T> = FirebaseFirestore.DocumentSnapshot<T>;

type ICollectionReference<T> = FirebaseFirestore.CollectionReference<T>;

type IDocumentQuery<T> = IFirestoreQuery<T>;

type IWriteResult = FirebaseFirestore.WriteResult;

export {
    IQuery,
    IOrderBy,
    IWriteResult,
    IDocumentData,
    IQueryOption,
    IDocumentQuery,
    IOperatorQuery,
    IDocumentSnapshot,
    IDocumentReference,
    ICollectionReference
};
