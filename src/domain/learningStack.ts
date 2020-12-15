import { injectable } from 'inversify';

import { Entity } from './entity';
import { ILearningStackEntity } from './types';

// Collection: learning_stacks
@injectable()
export class LearningStack extends Entity<ILearningStackEntity> {
    constructor(props: ILearningStackEntity) {
        super(props);
    }

    /**
     * Creates entity
     * @param props LearningStack properties
     * @returns LearningStack
     */
    public static create(props: ILearningStackEntity): LearningStack {
        const instance = new LearningStack(props);
        return instance;
    }

    get id(): string {
        return this._props.id || '';
    }
}
