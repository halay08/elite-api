import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import TYPES from '@/src/types';
import { Booking, Session, Room, LearningStack, ScheduledTask } from '@/domain';
import { BookingService, UserService } from './index';
import { PaymentProcessing, SessionStatus, BookingStatus, RoomStatus, LearningStatus } from '@/domain/types';
import { formatCurrency } from '@/app/helpers';
import {
    ChainOfEvents,
    BookingHandler,
    SessionHandler,
    LearningStackHandler,
    VideoCallHandler,
    ScheduledTaskHandler,
    NotificationHandler,
    IPaymentHandler,
    IPaymentRequestHandler,
    EmailBookingDataTypes
} from './paymentHandler';

@provide(TYPES.PaymentService)
export class PaymentService extends BookingService {
    @inject(TYPES.UserService) private readonly userService: UserService;
    @inject(TYPES.BookingService) private readonly bookingService: BookingService;

    /**
     * Handle the actions after verified that session booked successfully
     *
     * @param {PaymentProcessing} { sessionId,orderId }
     * @returns {String} bookingId
     * @memberof PaymentService
     */
    public async onSuccessTransaction({ sessionId, orderId, transactionId, amount }: PaymentProcessing) {
        // Get booking from orderId
        const booking: Booking = await this.bookingService.getBookingByOrderId(orderId);
        const { id: bookingId, student, tutor, bookedDate, bookingSession } = booking.serialize();
        const { startTime, duration, name: sessionName } = bookingSession;
        const bookingData: EmailBookingDataTypes = {
            sessionName,
            orderId,
            bookedDate,
            startTime,
            duration
        };

        // Change booking status to paid
        const bookingEvent: IPaymentRequestHandler<Booking> = {
            name: ChainOfEvents.BOOKING_HANDLER,
            data: {
                transactionId,
                status: BookingStatus.PAID,
                amount
            },
            id: bookingId as string
        };

        // Change session status to booked
        const sessionEvent: IPaymentRequestHandler<Session> = {
            name: ChainOfEvents.SESSION_HANDLER,
            data: {
                status: SessionStatus.BOOKED
            },
            id: sessionId
        };

        // Create learning stack
        const learningStackEvent: IPaymentRequestHandler<LearningStack> = {
            name: ChainOfEvents.LEARNINGSTACK_HANDLER,
            data: {
                booking: this.bookingService.getDocumentRef(`${bookingId}`),
                student: this.userService.getDocumentRef(`${student.id}`),
                tutor: this.userService.getDocumentRef(`${tutor.id}`),
                status: LearningStatus.BOOKED,
                earnedAmount: 0,
                startTime,
                comment: ''
            },
            id: ''
        };

        // Create a room for call
        const videoCallEvent: IPaymentRequestHandler<Room> = {
            name: ChainOfEvents.VIDEOCALL_HANDLER,
            data: {
                name: orderId,
                studentId: student.id,
                tutorId: tutor.id,
                status: RoomStatus.NOT_READY
            },
            id: ''
        };

        // Create a scheduled task to run in background
        const scheduledTaskEvent: IPaymentRequestHandler<ScheduledTask> = {
            name: ChainOfEvents.SCHEDULED_TASK_HANDLER,
            data: {
                performAt: startTime,
                options: {
                    student,
                    tutor,
                    bookingData
                }
            },
            id: ''
        };

        // Send email notification to student
        const notificationTaskEvent: IPaymentRequestHandler<any> = {
            name: ChainOfEvents.NOTIFICATION_TASK_HANDLER,
            data: {
                student: {
                    name: (student as any).name,
                    email: (student as any).email
                },
                tutor: {
                    name: (tutor as any).name,
                    email: (tutor as any).email
                },
                orderData: {
                    ...bookingData,
                    amount: formatCurrency(amount),
                    sessionName
                }
            },
            id: ''
        };

        // constructs the actual chain.
        const bookingHandler = new BookingHandler();
        bookingHandler
            .setNext(new SessionHandler())
            .setNext(new LearningStackHandler())
            .setNext(new VideoCallHandler())
            .setNext(new ScheduledTaskHandler())
            .setNext(new NotificationHandler());

        /**
         * The chainOfEvents is usually suited to work with a single handler. In most
         * cases, it is not even aware that the handler is part of a chain.
         */
        const chainOfEvents = () => {
            const listOfEvents: Array<IPaymentRequestHandler<any>> = [
                bookingEvent,
                sessionEvent,
                learningStackEvent,
                videoCallEvent,
                scheduledTaskEvent,
                notificationTaskEvent
            ];

            return {
                startAt: (handler: IPaymentHandler) => {
                    const tasks = listOfEvents.map((event: IPaymentRequestHandler<any>) => {
                        return handler.handle(event);
                    });

                    return Promise.all(tasks).catch(({ message }) => {
                        throw new Error(message);
                    });
                }
            };
        };

        return chainOfEvents().startAt(bookingHandler);
    }
}
