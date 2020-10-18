import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedUser } from '.';

export type IUserActivity = {
    user: IEmbedUser & domain.IObjectId;

    action_name: string;

    action_details: string;

    requestUrl: string;

    ipAddress: string;
};

/**
 * User activity entity
 */
export type IUserActivityEntity = domain.IEntity & Required<IUserActivity> & domain.ITimstamp;

// Collection user_activities
@injectable()
export default class UserActivity extends Entity<IUserActivityEntity> {
    constructor(props: IUserActivityEntity, _id?: string) {
        super(props, _id);
    }
}
