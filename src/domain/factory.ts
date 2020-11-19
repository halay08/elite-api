import { IEntity } from './types/entity';

export const factory = <T, K extends IEntity>(entity: new (props: K, _id?: string) => T, props: K, _id?: string): T => {
    return new entity(props, _id);
};
