import { ILearningStackEntity, ITutorEntity } from '@/src/domain/types';

type IGetLearningStackParams = {
    uid: string;
    status: string;
    startAfter: string;
    limit: number;
    from?: number;
    to?: number;
};

interface ISerializedLearningStack extends Omit<ILearningStackEntity, 'tutor'> {
    tutor: ITutorEntity;
}

export { ISerializedLearningStack, IGetLearningStackParams };
