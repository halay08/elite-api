import { User } from '@/domain';

/**
 * User mapper
 */
export class UserMapper {
    static toDomain(raw: any): User {
        return User.create({
            id: raw.id,

            role: raw.role,

            email: raw.email,

            name: raw.name,

            username: raw.username,

            avatar: raw.avatar,

            phoneNumber: raw.phoneNumber,

            surname: raw.surname,

            birthday: raw.birthday,

            shortIntro: raw.shortIntro,

            videoIntro: raw.videoIntro,

            address: raw.address,

            timezone: raw.timezone,

            country: raw.country,

            language: raw.language,

            category: raw.category,

            violations: raw.violations,

            status: raw.status,

            metadata: raw.metadata,

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        });
    }
}
