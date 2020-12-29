import { COLLECTIONS } from '@/src/infra/database/config/collection';
import * as functions from 'firebase-functions';
import Container from '@/src/container';
import { TutorReviewerService, TutorReviewerSummaryService, TutorService } from '../services';
import TYPES from '@/src/types';
import { admin } from '@/src/firebase.config';
import { TutorReviewerSummary } from '@/domain';
import { IDocumentReference } from '@/infra/database/types';
import { ITutorReviewerSummaryEntity } from '@/src/domain/types';
import { NotFoundError } from '@/app/errors';

const runTutorTransaction = async (userRef: IDocumentReference) => {
    const tutorService = Container.get<TutorService>(TYPES.TutorService);

    const { id } = userRef;

    // Get tutor entity record from userRef
    const tutor = await tutorService.getByUser(userRef);
    if (!tutor) {
        throw new NotFoundError('Tutor not found');
    }

    const tutorRef = tutorService.getDocumentRef(`${tutor.id}`);

    // Update aggregations in a transaction
    await admin.firestore().runTransaction(
        async (transaction): Promise<any> => {
            const tutorReviewerSummaryService = Container.get<TutorReviewerSummaryService>(
                TYPES.TutorReviewerSummaryService
            );

            // Get tutor review summary by id
            // Tutor(user) id, also tutor summary id, they're same
            const reviewerSummary = await tutorReviewerSummaryService.getById(`${id}`);
            if (!reviewerSummary) {
                throw new Error(`No reviewer summary record found`);
            }

            const { totalOfReviewer } = reviewerSummary || {};

            transaction.update(tutorRef, { reviews: totalOfReviewer });
        }
    );
};

/**
 * Build an aggregation transaction to update avg of reviewers for tutor collection when a new total reviewer summary record is created.
 * Firestore doesn't support aggregation feature like mongodb.
 * See more here https://cloud.google.com/firestore/docs/solutions/aggregation
 */
const onTutorReviewerSummaryCreate = functions.firestore
    .document(`${COLLECTIONS.TutorReviewerSummary}/{id}`)
    .onCreate(async (change, context) => {
        const data = change.data();

        const { tutor: tutorRef } = data;
        await runTutorTransaction(tutorRef);
    });

/**
 * Build an aggregation transaction to update avg of reviewers for tutor collection when a new total reviewer summary record is updated.
 * Firestore doesn't support aggregation feature like mongodb.
 * See more here https://cloud.google.com/firestore/docs/solutions/aggregation
 */
const onTutorReviewerSummaryUpdate = functions.firestore
    .document(`${COLLECTIONS.TutorReviewerSummary}/{id}`)
    .onUpdate(async (change, context) => {
        const dataBefore = change.before.data() as TutorReviewerSummary;
        const dataAfter = change.before.data() as TutorReviewerSummary;

        if (dataBefore.totalOfReviewer !== dataAfter.totalOfReviewer) {
            console.log(`Warning! Total of reviewers not changed`);
            return;
        }

        const { tutor: tutorRef } = dataAfter;
        await runTutorTransaction(tutorRef);
    });

/**
 * Build an aggregation transaction to calculate avg of reviewers when a new total reviewer record is created.
 * Firestore doesn't support aggregation feature like mongodb.
 * See more here https://cloud.google.com/firestore/docs/solutions/aggregation
 */
const onTutorReviewerCreate = functions.firestore
    .document(`${COLLECTIONS.TutorReviewer}/{id}`)
    .onCreate(async (change, context) => {
        const tutorReviewerService = Container.get<TutorReviewerService>(TYPES.TutorReviewerService);
        const tutorReviewerSummaryService = Container.get<TutorReviewerSummaryService>(
            TYPES.TutorReviewerSummaryService
        );

        const data = change.data();
        const { id: reviewerId } = context.params;
        const { tutor: tutorRef } = data;
        const tutorReviewers = await tutorReviewerService.findBy('tutor', tutorRef);
        const totalOfReviewer = tutorReviewers.length;

        // Update aggregations in a transaction
        await admin.firestore().runTransaction(
            async (transaction): Promise<any> => {
                const reviewer = await tutorReviewerService.getById(`${reviewerId}`);
                if (!reviewer) {
                    throw new Error(`No reviewer record found`);
                }

                // Get reviewer summary by tutor
                const tutorReviewerSummary = await tutorReviewerSummaryService.getById(tutorRef.id);
                const tutorReviewerSummaryRef = tutorReviewerSummaryService.getDocumentRef(`${tutorRef.id}`);

                const { punctual = 0, organized = 0, engaging = 0 } = tutorReviewerSummary || {};

                // Total of reviews
                const newPunctual = punctual + reviewer.punctual;
                const newOrganized = organized + reviewer.organized;
                const newEngaging = engaging + reviewer.engaging;

                // Update new tutor reviewer summary
                const tutorReviewerSummaryEntity: ITutorReviewerSummaryEntity = {
                    id: tutorRef.id,
                    tutor: tutorRef,
                    punctual: newPunctual,
                    organized: newOrganized,
                    engaging: newEngaging,
                    totalOfReviewer
                };

                // Update review summary for tutor
                if (tutorReviewerSummary) {
                    return transaction.update(tutorReviewerSummaryRef, tutorReviewerSummaryEntity);
                }

                return transaction.create(tutorReviewerSummaryRef, tutorReviewerSummaryEntity);
            }
        );
    });

export { onTutorReviewerSummaryCreate, onTutorReviewerSummaryUpdate, onTutorReviewerCreate };
