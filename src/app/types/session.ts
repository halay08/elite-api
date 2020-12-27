import { ITutorEntity, ISessionEntity } from '@/src/domain/types';

type ISessionQueryParam = {
    from?: Date;
    to?: Date;
};
type ITutorLearningStackSummary = {
    completed?: number;
    missed?: number;
    totalHour?: number;
};

interface ISessionDetail extends Omit<ISessionEntity, 'tutor'> {
    tutor: ITutorEntity;
}

export { ITutorLearningStackSummary, ISessionQueryParam, ISessionDetail };
