import { IEntity, ITimestamp } from '.';
import { IDocumentReference } from '@/src/infra/database/types';

type IUserActivity = {
    user: IDocumentReference;

    action_name: string;

    action_details?: string;

    requestUrl: string;

    ipAddress: string;

    object?: IDocumentReference;
};

/**
 * User activity entity
 */
type IUserActivityEntity = IEntity & IUserActivity & ITimestamp;

export { IUserActivity, IUserActivityEntity };
