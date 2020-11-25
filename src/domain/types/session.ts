import { ICourse, IEntity, ITimestamp, ICostType } from '.';
import { IEmbedBooking } from './booking';
import { IMediaEntity } from './media';

type ISessionMedia = Pick<IMediaEntity, 'name' | 'slug' | 'url' | 'metas'>;

enum ISessionStatus {
    AVAILABLE = 0,
    BOOKED = 1, // UNAVAILABLE
    CANCELLED = 2,
    PENDING = 3,
    COMPLETED = 4
}

type IEmbedSession = Required<IEntity> & Pick<ISession, 'name' | 'slug' | 'cost' | 'costType' | 'course'>;

type ISession = {
    // Topic name
    name: string;

    // URL path
    slug: string;

    course: Required<IEntity> & Pick<ICourse, 'name' | 'tutor' | 'status'>;

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
    costType: ICostType;

    content: string;

    photos?: ISessionMedia[];

    videos?: ISessionMedia[];

    referenceDocuments: ISessionMedia[];

    status: ISessionStatus;

    /**
     * The booking from student
     */
    booking: IEmbedBooking[];
};

/**
 * Session entity
 */
type ISessionEntity = IEntity & ISession & ITimestamp;

export { ISessionMedia, ISessionStatus, ISession, ISessionEntity, IEmbedSession };
