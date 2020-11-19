import { IUserEntity } from '@/domain/types';
import { User, factory as entityFactory } from '@/domain';

/**
 * User mapper
 */
export class UserMapper {
    public static toDomain(raw: any): User {
        const entity: IUserEntity = {
            role: raw.role,

            authId: raw.authId,

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

            createdAt: raw.createdAt,

            updatedAt: raw.updatedAt,

            deletedAt: raw.deletedAt
        };

        return entityFactory(User, entity, raw._id);
    }
}
