import { User } from '@/domain/user';

/**
 * User mapper
 */
export class UserMapper {
    public static toDomain(raw: any): User {
        return User.create(
            {
                name: raw.name,
                email: raw.email
            },
            raw._id
        );
    }
}
