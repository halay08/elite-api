import { IDocumentReference } from '@/src/infra/database/types';
import { IEntity, ITimestamp, CostType, IMedia } from '.';

enum SessionStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked'
}

type ISessionMedia = Pick<IMedia, 'name' | 'slug' | 'url' | 'metas'>;

type IRecurrenceSession = {
    type: 'daily' | 'weekly' | 'every_weekday' | 'monthly';
    endAt: Date;
};

type ISession = {
    // Topic name
    name: string;

    // URL path
    slug: string;

    course: IDocumentReference;

    startTime: Date;

    isRecurrence?: boolean;

    // Daily, weekly,...
    recurrences?: IRecurrenceSession;

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

    content?: string;

    photos?: ISessionMedia[];

    videos?: ISessionMedia[];

    referenceDocuments?: ISessionMedia[];

    /**
     * The booking from student
     */
    booking?: IDocumentReference[];

    status: SessionStatus;
};

/**
 * Session entity
 */
type ISessionEntity = IEntity & ISession & ITimestamp;

export { SessionStatus, ISession, ISessionEntity, ISessionMedia };
