import { injectable } from 'inversify';

import { Entity } from './entity';
import { IScheduledTaskEntity } from './types';

// Collection: scheduledTask
@injectable()
export class ScheduledTask extends Entity<IScheduledTaskEntity> {
    constructor(props: IScheduledTaskEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props ScheduledTask properties
     * @returns ScheduledTask
     */
    public static create(props: IScheduledTaskEntity): ScheduledTask {
        const instance = new ScheduledTask(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get performAt(): Date {
        return this._props.performAt || 0;
    }

    get status(): string {
        return this._props.status || '';
    }

    get method(): string {
        return this._props.method || '';
    }

    get options(): Object {
        return this._props.options || {};
    }
}
