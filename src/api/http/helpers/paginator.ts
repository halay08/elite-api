import { IPaginationResponse } from '../../types/pagination';
import { IEntity } from '@/domain/types';

export const paginate = <T extends IEntity>(items: T[], filter?: object, sort?: object): IPaginationResponse<T> => {
    return {
        pagination: {
            lastRef: items[0]?.id || '',
            totalItemOfPage: items.length
        },
        filter,
        sort,
        items
    };
};
