import { IEmbedUser, IEntity, ITimstamp } from '.';

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
type IUserActivityEntity = IEntity & IUserActivity & ITimstamp;

export { IUserActivity, IUserActivityEntity };
