import { ITutorEntity, ISessionEntity } from '@/src/domain/types';

type ISessionQueryParam = {
    from?: Date;
    to?: Date;
};

interface ISessionDetail extends Omit<ISessionEntity, 'tutor'> {
    tutor: ITutorEntity;
}

export { ISessionQueryParam, ISessionDetail };
