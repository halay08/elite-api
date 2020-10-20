import { User } from '@/domain/user';
/**
 * User mapper
 */
export class UserMapper {
    public static toDomain(raw: any): User {
        return User.create(
            {
                role: raw.role,
                email: raw.email,
                createdAt: raw.createdAt
            },
            raw._id
        );
    }
}
