import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { IBookingEntity, BookingStatus, UserRole, LearningStatus, ILearningStackEntity } from '@/src/domain/types';
import { inject } from 'inversify';
import { Session, Booking, LearningStack } from '@/domain';
import { NotFoundError } from '@/app/errors';
import { IDocumentReference } from '@/src/infra/database/types';
import { ISessionRepository, IBookingRepository, ILearningStackRepository } from '@/src/infra/database/repositories';
import * as time from '@/src/app/helpers';
import { BaseSeeding } from './base';

@provide(TYPES.BookingSeeding)
export class BookingSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.BookingRepository) private readonly bookingRepository: IBookingRepository;
    @inject(TYPES.SessionRepository) private readonly sessionRepository: ISessionRepository;
    @inject(TYPES.LearningStackRepository) private readonly learningStackRepository: ILearningStackRepository;

    /**
     * Get sessions to embed to the booking
     * @returns Session[]
     */
    private async getSessions(): Promise<Session[]> {
        const sessions = await this.sessionRepository.query([], { limit: 2 });

        if (sessions.length === 0) {
            throw new NotFoundError('No session found in the system');
        }

        return sessions;
    }

    /**
     * Get the session references to embed to the booking
     * @param sessions List of sessions from database
     * @returns IDocumentReference[]
     */
    private getSessionReferences(sessions: Session[]): IDocumentReference[] {
        // Session reference data
        const sessionReferences: IDocumentReference[] = [];

        for (const session of sessions) {
            const sessionEntity = session.serialize();
            const sessionRef = this.sessionRepository.getDocumentRef(`${sessionEntity.id}`);
            sessionReferences.push(sessionRef);
        }

        return sessionReferences;
    }

    async getBookingData(): Promise<IBookingEntity[]> {
        const studentReferences = await this.getUserReferences(UserRole.STUDENT);
        const tutorReferences = await this.getUserReferences(UserRole.TUTOR);
        const sessions = await this.getSessions();
        const sessionReferences: IDocumentReference[] = this.getSessionReferences(sessions);

        return [
            {
                student: studentReferences[0],
                tutor: tutorReferences[0],
                originSession: sessionReferences[0],
                bookingSession: {
                    name: sessions[0].props.name,
                    startTime: sessions[0].props.startTime,
                    duration: sessions[0].props.duration,
                    cost: sessions[0].props.cost,
                    costType: sessions[0].props.costType
                },
                orderId: 'MOMO1000000',
                bookedDate: time.getCurrentUTCDate(),
                amount: '100',
                paymentMethod: 'momo',
                transactionId: '2302586804',
                status: BookingStatus.PAID
            },
            {
                student: studentReferences[1],
                tutor: tutorReferences[1],
                originSession: sessionReferences[1],
                bookingSession: {
                    name: sessions[1].props.name,
                    startTime: sessions[1].props.startTime,
                    duration: sessions[1].props.duration,
                    cost: sessions[1].props.cost,
                    costType: sessions[1].props.costType
                },
                orderId: 'MOMO1000001',
                bookedDate: time.getCurrentUTCDate(),
                amount: '200',
                paymentMethod: 'momo',
                transactionId: '2302586804',
                status: BookingStatus.PAID
            }
        ];
    }

    async run() {
        const bookings = await this.getBookingData();
        for (const booking of bookings) {
            const existedBooking = await this.bookingRepository.findBy('orderId', booking.orderId);
            if (existedBooking.length > 0) {
                console.log(`Booking with number ${booking.orderId} already existed in the database`);
                continue;
            }

            const model: Booking = Booking.create(booking);
            const newModel = await this.bookingRepository.create(model);
            const modelEntity: IBookingEntity = newModel.serialize();
            console.log(`New booking was created ${modelEntity.orderId}`);

            // Create learning stack record
            await this.createLearningStack(modelEntity);
        }

        console.log('DONE!');
    }

    async createLearningStack(booking: IBookingEntity): Promise<void> {
        const bookingRef = this.bookingRepository.getDocumentRef(`${booking.id}`);
        const existedBooking = await this.learningStackRepository.findBy('booking', bookingRef);
        if (existedBooking.length > 0) {
            console.log(`---Learning stack with booking ${booking.orderId} already existed in the database`);
            return;
        }

        const studentReferences = await this.getUserReferences(UserRole.STUDENT);
        const tutorReferences = await this.getUserReferences(UserRole.TUTOR);
        const startTime = booking.bookingSession.startTime;

        const model: LearningStack = LearningStack.create({
            booking: bookingRef,
            student: studentReferences[0],
            tutor: tutorReferences[0],
            status: LearningStatus.BOOKED,
            startTime,
            comment: '',
            earnedAmount: 0
        });
        const newModel = await this.learningStackRepository.create(model);
        const modelEntity: ILearningStackEntity = newModel.serialize();
        console.log(`--- New learning stack was created ${modelEntity.id}`);
    }
}
