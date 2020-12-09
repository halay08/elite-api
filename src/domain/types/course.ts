import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity, ITimestamp, ILanguage } from '.';

enum CourseStatus {
    AVAILABLE = 0,
    BOOKED = 1, // UNAVAILABLE
    CANCELLED = 2,
    PENDING = 3,
    COMPLETED = 4
}

type ICoursePolicyCondition = {
    allow: boolean;

    condition: number;

    refundPercent: number;
};

type ICoursePolicy = {
    freeFirstCourse: boolean;

    // Allow to cancel course before starting
    cancelBeforeStarting: ICoursePolicyCondition;

    // Allow to cancel course while it's in progress
    cancelInProgress: ICoursePolicyCondition;

    // Allow to cancel session before the course starts
    cancelSessionBeforeStarting: ICoursePolicyCondition;

    // Allow to cancel session while the course is in progress
    cancelSessionInProgress: ICoursePolicyCondition;
};

type ICourse = {
    name: string;

    slug: string;

    presentationLanguage: Pick<ILanguage, 'code' | 'name'>;

    description?: string;

    benefits: string[];

    detailContent: string;

    requirements?: string[];

    policy: ICoursePolicy;

    tutor: IDocumentReference;

    sessions?: IDocumentReference[];

    status: CourseStatus;
};

/**
 * Course entity
 */
type ICourseEntity = IEntity & ICourse & ITimestamp;

export { ICourse, ICourseEntity, CourseStatus, ICoursePolicy };
