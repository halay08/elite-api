import { ITimestamp, IEntity } from './index';

type I#### = {
    name: string;
};

type I####Entity = IEntity & I#### & ITimestamp;

export { I####, I####Entity };
