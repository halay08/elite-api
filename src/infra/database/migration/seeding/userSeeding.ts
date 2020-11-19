import { inject } from 'inversify';
import TYPES from '@/src/types';
import { IUserRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { IUserEntity, UserStatus, UserRole } from '@/domain/types';
import ISeeding from './seedingInterface';

@provide(TYPES.UserSeeding)
class UserSeeding implements ISeeding {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository
    ) {}

    async run() {
        const users: Partial<IUserEntity>[] = [
            {
                role: UserRole.STUDENT,
                email: 'user1@example.com',
                status: UserStatus.ACTIVE
            },
            {
                role: UserRole.STUDENT
            },
            {
                role: UserRole.TUTOR,
                email: 'user3@example.com',
                status: UserStatus.ACTIVE
            }
        ];

        for (const user of users) {
            const existedUser = await this.userRepository.findBy('email', user.email);
            if (existedUser.length > 0) {
                console.log(`User ${user.email} already existed in the database`);
                continue;
            }

            const newUser = await this.userRepository.create(user);
            console.log(`New user was created ${newUser}`);
        }

        console.log('DONE!');
    }
}

export default UserSeeding;
