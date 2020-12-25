import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity, ITimestamp, ILanguage } from '.';
import { Course } from '@/domain';

enum CourseStatus {
    AVAILABLE = 0,
    BOOKED = 1, // UNAVAILABLE
    CANCELLED = 2,
    PENDING = 3,
    COMPLETED = 4
}

enum CourseType {
    FULL = 'full',
    FREEDOM = 'freedom'
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
    type: CourseType;

    name: string;

    slug: string;

    presentationLanguage: Pick<ILanguage, 'code' | 'name'>;

    description?: string;

    benefits: string[];

    detailContent: string;

    requirements?: string[];

    policy: ICoursePolicy;

    // Ref to User table
    tutor: IDocumentReference;

    sessions?: IDocumentReference[];

    status: CourseStatus;
};

/**
 * Course entity
 */
type ICourseEntity = IEntity & ICourse & ITimestamp;

/**
 * Course detail
 */
type ICourseDetail = Partial<Course> & { totalCost: number };

export { ICourse, ICourseEntity, CourseStatus, ICoursePolicy, CourseType, ICourseDetail };
