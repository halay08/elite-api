import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { UserRole, ITutorReviewerEntity, ITutorReviewer } from '@/src/domain/types';
import { inject } from 'inversify';
import { TutorReviewer } from '@/domain';
import { IQuery } from '@/src/infra/database/types';
import { ITutorReviewerRepository } from '@/src/infra/database/repositories';
import { BaseSeeding } from './base';

@provide(TYPES.TutorReviewerSeeding)
export class TutorReviewerSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.TutorReviewerRepository) private readonly tutorReviewerRepository: ITutorReviewerRepository;

    async getReviewerData(): Promise<ITutorReviewerEntity[]> {
        const studentReferences = await this.getUserReferences(UserRole.STUDENT);
        const tutorReferences = await this.getUserReferences(UserRole.TUTOR);

        return [
            {
                student: studentReferences[0],
                tutor: tutorReferences[0],
                punctual: 4,
                organized: 3,
                engaging: 5,
                comment: `
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat`
            },
            {
                student: studentReferences[0],
                tutor: tutorReferences[1],
                punctual: 2,
                organized: 4,
                engaging: 1,
                comment: `
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                `
            },
            {
                student: studentReferences[1],
                tutor: tutorReferences[0],
                punctual: 4,
                organized: 3,
                engaging: 3,
                comment: `
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
                totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo
                `
            },
            {
                student: studentReferences[1],
                tutor: tutorReferences[1],
                punctual: 4,
                organized: 5,
                engaging: 2,
                comment: `
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, 
                sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt
                `
            }
        ];
    }

    async run() {
        const reviews = await this.getReviewerData();
        for (const review of reviews) {
            const queries: IQuery<ITutorReviewer>[] = [
                {
                    tutor: review.tutor
                },
                {
                    student: review.student
                }
            ];
            const existedReview = await this.tutorReviewerRepository.query(queries);
            if (existedReview.length > 0) {
                console.log(`Student ${review.student.id} already gave the review for tutor ${review.tutor.id}`);
                continue;
            }

            const model: TutorReviewer = TutorReviewer.create(review);
            const newModel = await this.tutorReviewerRepository.create(model);
            const modelEntity: ITutorReviewerEntity = newModel.serialize();
            console.log(`New review record was created ${modelEntity.id}`);
        }

        console.log('DONE!');
    }
}
