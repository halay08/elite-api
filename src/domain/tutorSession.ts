import { injectable } from 'inversify';

import { Entity } from './entity';
import { domain, IEmbedBooking, IEmbedUser } from '.';

export enum CostType {
    CASH = 'cash',
    COINT = 'coin'
}

export enum TutorSessionStatus {
    AVAILABLE = 0,
    BOOKED = 1, // UNAVAILABLE
    CANCELLED = 2,
    PENDING = 3,
    COMPLETED = 4
}

export type IEmbedTutorSession = {
    topicName: string;

    tutor: NonNullable<IEmbedUser>;

    date: Date;

    startTime: domain.ISessionTime;

    /**
     * Time for the session (minute)
     */
    duration: number;

    /**
     * [2020-10-19,2020-10-20,...]
     */
    repeatOn: Date[];

    /**
     * The cost of session, including service fee, tax
     */
    cost: number;

    /**
     * We might consider to use credit-coin to sell the session
     */
    costType: CostType;
};

export type ITutorSession = IEmbedTutorSession & {
    status: TutorSessionStatus;

    /**
     * The bookings from student
     */
    booking: IEmbedBooking[];
};

/**
 * TutorSession entity
 */
export type ITutorSessionEntity = domain.IEntity & ITutorSession & domain.ITimstamp;

@injectable()
export default class TutorSession extends Entity<ITutorSessionEntity> {
    constructor(props: ITutorSessionEntity, _id?: string) {
        super(props, _id);
    }
}
