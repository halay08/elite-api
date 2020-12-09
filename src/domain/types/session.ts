import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity, ITimestamp, CostType, IMedia } from '.';

enum ISessionStatus {
    AVAILABLE = 0,
    BOOKED = 1, // UNAVAILABLE
    CANCELLED = 2,
    PENDING = 3,
    COMPLETED = 4
}

type ISessionMedia = Pick<IMedia, 'name' | 'slug' | 'url' | 'metas'>;

type ISession = {
    // Topic name
    name: string;

    // URL path
    slug: string;

    course: IDocumentReference;

    startTime: Date;

    /**
     * Time for the session (minute)
     */
    duration: number;

    /**
     * The cost of session, including service fee, tax
     */
    cost: number;

    /**
     * We might consider to use credit-coin to sell the session
     */
    costType: CostType;

    content: string;

    photos?: ISessionMedia[];

    videos?: ISessionMedia[];

    referenceDocuments: ISessionMedia[];

    /**
     * The booking from student
     */
    booking?: IDocumentReference[];

    status: ISessionStatus;
};

/**
 * Session entity
 */
type ISessionEntity = IEntity & ISession & ITimestamp;

export { ISessionStatus, ISession, ISessionEntity, ISessionMedia };
