import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { IBookingEntity, BookingStatus, LearningStatus, ILearningStackEntity } from '@/src/domain/types';
import { inject } from 'inversify';
import { Student, Tutor, Session, Booking, LearningStack } from '@/domain';
import { NotFoundError } from '@/app/errors';
import { IDocumentReference } from '@/src/infra/database/types';
import { COLLECTIONS } from '../../config/collection';
import {
    ISessionRepository,
    IStudentRepository,
    ITutorRepository,
    IBookingRepository,
    LearningStackRepository
} from '@/src/infra/database/repositories';
import { time } from '@/src/app/helpers';

@provide(TYPES.BookingSeeding)
export class BookingSeeding implements ISeeding {
    constructor(
        @inject(TYPES.BookingRepository) private readonly bookingRepository: IBookingRepository,
        @inject(TYPES.LearningStackRepository) private readonly learningStackRepository: LearningStackRepository,
        @inject(TYPES.StudentRepository) private readonly studentRepository: IStudentRepository,
        @inject(TYPES.TutorRepository) private readonly tutorRepository: ITutorRepository,
        @inject(TYPES.SessionRepository) private readonly sessionRepository: ISessionRepository
    ) {}

    /**
     * Get students to embed to the booking
     * @returns Student[]
     */
    private async getStudents(): Promise<Student[]> {
        const students = await this.studentRepository.query([], { limit: 2 });

        if (students.length === 0) {
            throw new NotFoundError('No student found in the system');
        }

        return students;
    }

    /**
     * Get tutors to embed to the booking
     * @returns Tutor[]
     */
    private async getTutors(): Promise<Tutor[]> {
        const tutors = await this.tutorRepository.query([], { limit: 2 });

        if (tutors.length === 0) {
            throw new NotFoundError('No tutor found in the system');
        }

        return tutors;
    }

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
     * Get the student references to embed to the booking
     * @param students List of students from database
     * @returns IDocumentReference[]
     */
    private getReferenceStudents(students: Student[]): IDocumentReference[] {
        // Student reference data
        const studentReferences: IDocumentReference[] = [];

        for (const student of students) {
            const studentEntity = student.serialize();
            const studentRef = this.studentRepository.getDocumentRef(`${COLLECTIONS.Student}/${studentEntity.id}`);
            studentReferences.push(studentRef);
        }

        return studentReferences;
    }

    /**
     * Get the tutor references to embed to the booking
     * @param tutors List of tutor from database
     * @returns IDocumentReference[]
     */
    private getReferenceTutors(tutors: Tutor[]): IDocumentReference[] {
        // Student reference data
        const tutorReferences: IDocumentReference[] = [];

        for (const tutor of tutors) {
            const tutorEntity = tutor.serialize();
            const tutorRef = this.tutorRepository.getDocumentRef(`${COLLECTIONS.Tutor}/${tutorEntity.id}`);
            tutorReferences.push(tutorRef);
        }

        return tutorReferences;
    }

    /**
     * Get the session references to embed to the booking
     * @param sessions List of sessions from database
     * @returns IDocumentReference[]
     */
    private getReferenceSessions(sessions: Session[]): IDocumentReference[] {
        // Session reference data
        const sessionReferences: IDocumentReference[] = [];

        for (const session of sessions) {
            const sessionEntity = session.serialize();
            const sessionRef = this.sessionRepository.getDocumentRef(`${COLLECTIONS.Session}/${sessionEntity.id}`);
            sessionReferences.push(sessionRef);
        }

        return sessionReferences;
    }

    async getBookingData(): Promise<IBookingEntity[]> {
        const students = await this.getStudents();
        const tutors = await this.getTutors();
        const sessions = await this.getSessions();
        const studentReferences: IDocumentReference[] = this.getReferenceStudents(students);
        const tutorReferences: IDocumentReference[] = this.getReferenceTutors(tutors);
        const sessionReferences: IDocumentReference[] = this.getReferenceSessions(sessions);

        return [
            {
                student: studentReferences[0],
                tutor: tutorReferences[0],
                originSession: sessionReferences[0],
                bookingSession: {
                    startTime: sessions[0].props.startTime,
                    duration: sessions[0].props.duration,
                    cost: sessions[0].props.cost,
                    costType: sessions[0].props.costType
                },
                orderId: 'MOMO1000000',
                transactionId: 'MOMO1000000',
                bookedDate: time.getCurrentUTCDate(),
                amount: 100,
                paymentMethod: 'momo',
                status: BookingStatus.BOOKED
            },
            {
                student: studentReferences[1],
                tutor: tutorReferences[0],
                originSession: sessionReferences[1],
                bookingSession: {
                    startTime: sessions[1].props.startTime,
                    duration: sessions[1].props.duration,
                    cost: sessions[1].props.cost,
                    costType: sessions[1].props.costType
                },
                orderId: 'MOMO1000001',
                transactionId: 'MOMO1000001',
                bookedDate: time.getCurrentUTCDate(),
                amount: 200,
                paymentMethod: 'momo',
                status: BookingStatus.BOOKED
            }
        ];
    }

    async run() {
        const bookings = await this.getBookingData();
        for (const booking of bookings) {
            const existedBooking = await this.bookingRepository.findBy('bookingNumber', booking.orderId);
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
        const existedBooking = await this.learningStackRepository.findBy('bookingNumber', booking.orderId);
        if (existedBooking.length > 0) {
            console.log(`---Learning stack with booking ${booking.orderId} already existed in the database`);
            return;
        }

        const tutorRef = this.studentRepository.getDocumentRef(`${COLLECTIONS.Tutor}/${booking.tutor.id}`);
        const studentRef = this.studentRepository.getDocumentRef(`${COLLECTIONS.Student}/${booking.student.id}`);
        const bookingRef = this.bookingRepository.getDocumentRef(`${COLLECTIONS.Booking}/${booking.id}`);

        const model: LearningStack = LearningStack.create({
            booking: bookingRef,
            student: studentRef,
            tutor: tutorRef,
            status: LearningStatus.BOOKED,
            comment: ''
        });
        const newModel = await this.learningStackRepository.create(model);
        const modelEntity: ILearningStackEntity = newModel.serialize();
        console.log(`--- New learning stack was created ${modelEntity.id}`);
    }
}
