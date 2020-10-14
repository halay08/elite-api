import { User } from '@/domain/user';

export class UserMapper {
    public static toDomain(raw: any): User {
        return User.create({
            id: raw.id,
            name: raw.name,
            email: raw.email
        });
    }
}
