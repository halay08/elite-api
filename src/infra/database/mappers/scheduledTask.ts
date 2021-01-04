import { ScheduledTask } from '@/domain';

/**
 * ScheduledTask mapper
 */
export class ScheduledTaskMapper {
    public static toDomain(raw: any): ScheduledTask {
        return ScheduledTask.create({
            id: raw.id,

            performAt: raw.performAt,

            method: raw.method,

            options: raw.options,

            status: raw.status,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
