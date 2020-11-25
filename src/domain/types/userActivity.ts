import { IEmbedUser, IEntity, ITimestamp } from '.';

type IUserActivity = {
    user: IEmbedUser & Required<IEntity>;

    action_name: string;

    action_details: string;

    requestUrl: string;

    ipAddress: string;
};

/**
 * User activity entity
 */
type IUserActivityEntity = IEntity & IUserActivity & ITimestamp;

export { IUserActivity, IUserActivityEntity };
