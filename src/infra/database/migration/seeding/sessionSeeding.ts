import { inject } from 'inversify';
import TYPES from '@/src/types';
import { ICourseRepository, ISessionRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { Session, Course } from '@/domain';
import { NotFoundError } from '@/src/app/errors';
import { CostType, ISessionMedia, SessionStatus } from '@/domain/types';
import { time } from '@/app/helpers';
import { IDocumentReference } from '../../types';
import { COLLECTIONS } from '../../config/collection';

@provide(TYPES.SessionSeeding)
export class SessionSeeding implements ISeeding {
    constructor(
        @inject(TYPES.SessionRepository)
        private readonly _sessionRepository: ISessionRepository,
        @inject(TYPES.CourseRepository)
        private readonly _courseRepository: ICourseRepository
    ) {}

    /**
     * Get the courses to embed to the session
     */
    private async getCourses(): Promise<Course[]> {
        const users = await this._courseRepository.findAll({ limit: 10 });

        if (users.length === 0) {
            throw new NotFoundError('No user found in the system');
        }

        return users;
    }

    /**
     * Gets photos
     * @returns IMedia[]
     */
    private getPhotos(): ISessionMedia[] {
        return [
            {
                name: 'Photo 1',
                slug: 'photo-1',
                url: 'https://www.elc.edu/wp-content/themes/Orion/images/dummies/general-english-courses-classmates.png'
            },
            {
                name: 'Photo 2',
                slug: 'photo-2',
                url:
                    'https://www.elc.edu/wp-content/themes/Orion/images/dummies/general-english-courses-elc-los-angeles-classroom.png'
            },
            {
                name: 'Photo 3',
                slug: 'photo-3',
                url:
                    'https://www.elc.edu/wp-content/themes/Orion/images/dummies/general-english-courses-computer-lab.png'
            }
        ];
    }

    /**
     * Gets videos
     * @returns IMedia[]
     */
    private getVideos(): ISessionMedia[] {
        return [
            {
                name: 'Video 1',
                slug: 'video-1',
                url: 'https://www.youtube.com/watch?v=IeaadwctbD4'
            },
            {
                name: 'Video 2',
                slug: 'video-2',
                url: 'https://www.youtube.com/watch?v=S2lFmQcXsM4'
            },
            {
                name: 'Video 3',
                slug: 'video-3',
                url: 'https://www.youtube.com/watch?v=QTd9Hu-1RH0'
            }
        ];
    }

    private async getSessionData(): Promise<Session[]> {
        const courses = await this.getCourses();
        const courseReferences: IDocumentReference[] = [];

        for (const course of courses) {
            const courseEntity = course.serialize();
            const courseRef = this._courseRepository.getDocumentRef(`${COLLECTIONS.Course}/${courseEntity.id}`);
            courseReferences.push(courseRef);
        }

        const startTime: Date[] = [
            time.getCustomTime({ date: 20, month: 12, hour: 8, minute: 30, second: 0 }),
            time.getCustomTime({ date: 20, month: 12, hour: 9, minute: 30, second: 0 }),
            time.getCustomTime({ date: 21, month: 12, hour: 9, minute: 30, second: 0 })
        ];

        return [
            Session.create({
                name: 'Intensive English lesson 1',
                slug: 'intensive-english-lesson-1',
                course: courseReferences[0],
                startTime: startTime[0],
                duration: 60,
                cost: 250,
                costType: CostType.CASH,
                content: `The 30-lesson per week Intensive English Course is ELC's most popular course and covers all of the major language skills including: grammar, vocabulary, conversation, pronunciation, listening comprehension, reading, and writing. All intermediate and advanced students also have a choice of electives two afternoons per week`,
                photos: this.getPhotos(),
                videos: this.getVideos(),
                referenceDocuments: [],
                isRecurrence: false,
                recurrences: null as any,
                booking: [],
                status: SessionStatus.AVAILABLE
            }),
            Session.create({
                name: 'Intensive English lesson 2',
                slug: 'intensive-english-lesson-2',
                course: courseReferences[0],
                startTime: startTime[1],
                duration: 60,
                cost: 250,
                costType: CostType.CASH,
                content: `The 30-lesson per week Intensive English Course is ELC's most popular course and covers all of the major language skills including: grammar, vocabulary, conversation, pronunciation, listening comprehension, reading, and writing. All intermediate and advanced students also have a choice of electives two afternoons per week`,
                photos: this.getPhotos(),
                videos: this.getVideos(),
                referenceDocuments: [],
                isRecurrence: false,
                recurrences: null as any,
                booking: [],
                status: SessionStatus.AVAILABLE
            }),
            Session.create({
                name: 'Building Your English Brain lesson 1',
                slug: 'building-your-english-brain-lesson-1',
                course: courseReferences[1],
                startTime: startTime[2],
                duration: 60,
                cost: 250,
                costType: CostType.CASH,
                content: `The 30-lesson per week Intensive English Course is ELC's most popular course and covers all of the major language skills including: grammar, vocabulary, conversation, pronunciation, listening comprehension, reading, and writing. All intermediate and advanced students also have a choice of electives two afternoons per week`,
                photos: this.getPhotos(),
                videos: this.getVideos(),
                referenceDocuments: [],
                isRecurrence: false,
                recurrences: null as any,
                booking: [],
                status: SessionStatus.AVAILABLE
            })
        ];
    }

    async run() {
        const sessions = await this.getSessionData();

        for (const session of sessions) {
            const existedSession = await this._sessionRepository.findBy('slug', session.slug);
            if (existedSession.length > 0) {
                console.log(`Session with name ${session.name} already existed in the database`);
                continue;
            }

            const sessionModel: Session = Session.create(session.serialize());
            const newSession = await this._sessionRepository.create(sessionModel);
            console.log(`New session was created ${newSession.id}`);
        }

        console.log('DONE!');
    }
}
