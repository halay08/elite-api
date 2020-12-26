import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import TYPES from '@/src/types';
import { Booking, Room, LearningStack } from '@/domain';
import { SessionService, BookingService, RoomService, LearningStackService, UserService } from './index';
import { PaymentProcessing, SessionStatus, BookingStatus, RoomStatus, LearningStatus } from '@/domain/types';
import { EmailAdapter, Vendor, TemplateType } from '@/src/infra/notification/mail';

@provide(TYPES.PaymentService)
export class PaymentService extends BookingService {
    @inject(TYPES.SessionService) private readonly sessionService: SessionService;
    @inject(TYPES.UserService) private readonly userService: UserService;
    @inject(TYPES.BookingService) private readonly bookingService: BookingService;
    @inject(TYPES.RoomService) private readonly roomService: RoomService;
    @inject(TYPES.LearningStackService) private readonly learningStackService: LearningStackService;

    /**
     * Handle the actions after verified that session booked successfully
     *
     * @param {PaymentProcessing} { sessionId,orderId }
     * @returns {String} bookingId
     * @memberof PaymentService
     */
    public async onSuccessTransaction({ sessionId, orderId, transactionId }: PaymentProcessing) {
        // Get booking from orderId
        const booking: Booking = await this.bookingService.getBookingByOrderId(orderId);
        const { id: bookingId, student, tutor, bookedDate } = booking.serialize();

        // Change booking status to paid
        const updateBookingStatus = this.bookingService.update(bookingId as string, {
            transactionId,
            status: BookingStatus.PAID
        });

        // Create a room for call
        const room: Room = Room.create({
            name: orderId,
            studentId: student.id,
            teacherId: tutor.id,
            status: RoomStatus.NOT_READY
        });
        const createRoom = this.roomService.create(room);

        // Create a session stack
        const learningStack: LearningStack = LearningStack.create({
            booking: this.bookingService.getDocumentRef(`${bookingId}`),
            student: this.userService.getDocumentRef(`${student.id}`),
            tutor: this.userService.getDocumentRef(`${tutor.id}`),
            status: LearningStatus.BOOKED,
            earnedAmount: 0,
            comment: ''
        });
        const createLearningStack = this.learningStackService.create(learningStack);

        // Change session status to booked
        const updateSessionStatus = this.sessionService.update(sessionId, {
            status: SessionStatus.BOOKED
        });

        return Promise.all([updateBookingStatus, createRoom, createLearningStack, updateSessionStatus])
            .then(() => {
                // Send email notification to student
                const data = {
                    name: (student as any).name,
                    orderId,
                    bookedDate
                };

                const notification = new EmailAdapter((student as any).email, TemplateType.BOOKING, data, Vendor.GMAIL);
                notification.send();
            })
            .catch(({ message }) => {
                throw new Error(message);
            });
    }
}
