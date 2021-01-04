import Container from '@/src/container';
import TYPES from '@/src/types';
import { ChainOfEvents, IPaymentRequestHandler } from './paymentHandlerInterface';
import { AbstractHandler } from './abstractHandler';
import { LearningStack } from '@/domain';
import { ILearningStackEntity } from '@/domain/types';
import { LearningStackService } from '../index';

export class LearningStackHandler extends AbstractHandler<LearningStack> {
    public handle({ name, data, id }: IPaymentRequestHandler<LearningStack>): Promise<LearningStack> {
        if (name === ChainOfEvents.LEARNINGSTACK_HANDLER) {
            const learningStackService = Container.get<LearningStackService>(TYPES.LearningStackService);

            const learningStack: LearningStack = LearningStack.create(data as ILearningStackEntity);
            const updateLearningStackStatus = learningStackService.create(learningStack);

            return updateLearningStackStatus;
        }

        return super.handle({ name, data, id });
    }
}
