import { Room } from '@/domain';

/**
 * Room mapper
 */
export class RoomMapper {
    public static toDomain(raw: any): Room {
        return Room.create({
            name: raw.name,

            studentId: raw.studentId,

            tutorId: raw.tutorId,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
