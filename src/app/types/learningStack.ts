import { ILearningStackEntity, ITutorEntity } from '@/src/domain/types';

type ITutorLearningStackSummary = {
    completed?: number;
    missed?: number;
    totalHour?: number;
};

type IGetLearningStackParams = {
    uid: string;
    status: string;
    startAfter: string;
    limit: number;
};

interface ISerializedLearningStack extends Omit<ILearningStackEntity, 'tutor'> {
    tutor: ITutorEntity;
}

export { ITutorLearningStackSummary, ISerializedLearningStack, IGetLearningStackParams };
