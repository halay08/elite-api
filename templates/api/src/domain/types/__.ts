import { ITimestamp, IEntity } from './index';

type I#### = {
    id: string;
};

type I####Entity = IEntity & I#### & ITimestamp;

export { I####, I####Entity };
