import { injectable } from 'inversify';
import { IDocumentReference } from '../infra/database/types';

import { Entity } from './entity';
import { ISessionEntity } from './types';

@injectable()
export class Session extends Entity<ISessionEntity> {
    constructor(props: ISessionEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props Session properties
     * @returns Session
     */
    public static create(props: ISessionEntity): Session {
        const instance = new Session(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }

    get name(): string {
        return this._props.name;
    }

    get slug(): string {
        return this._props.slug;
    }

    get course(): IDocumentReference {
        return this._props.course;
    }

    get startTime(): Date {
        return this._props.startTime;
    }

    get duration(): number {
        return this._props.duration;
    }

    get cost(): number {
        return this._props.cost;
    }

    get costType(): string {
        return this._props.costType;
    }
}
