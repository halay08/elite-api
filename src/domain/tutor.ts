import { injectable } from 'inversify';

import { Entity } from './entity';
import { ITutorEntity } from './types';

// Collection: tutors
@injectable()
export default class Tutor extends Entity<ITutorEntity> {
    constructor(props: ITutorEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props TutorWallet properties
     * @returns TutorWallet
     */
    public static create(props: ITutorEntity): Tutor {
        const instance = new Tutor(props);
        return instance;
    }

    get id(): string {
        return this._id;
    }
}
