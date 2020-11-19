type IOrderBy<T> = {
    field: keyof T | keyof T[];

    order: 'desc' | 'asc';
};

type IOperatorQuery<T, K> = {
    [K in keyof T]?: any;
} & {
    operator: K;
};

type IQuery<T> = IOperatorQuery<T, any>;

type IQueryOption<T> = {
    withTrashed: boolean;

    limit: number;

    startAt: number;

    orderBy: IOrderBy<T>;
};

export { IOrderBy, IOperatorQuery, IQuery, IQueryOption };
