import { inject, injectable } from 'inversify';
import TYPES from '@/src/types';
import { UserRole } from '@/domain/types';
import { IUserRepository, ITutorRepository } from '@/src/infra/database/repositories';
import { User } from '@/domain';
import { NotFoundError } from '@/app/errors';
import { IDocumentReference } from '../../types';
import { COLLECTIONS } from '../../config/collection';

@injectable()
export class BaseSeeding {
    @inject(TYPES.UserRepository)
    protected readonly _userRepository: IUserRepository;
    @inject(TYPES.TutorRepository)
    protected readonly _tutorRepository: ITutorRepository;

    /**
     * Get the user to embed to tutor
     */
    private async getUsers(role: UserRole): Promise<User[]> {
        const users = await this._userRepository.query([{ role, operator: '==' }], { limit: 10 });

        if (users.length === 0) {
            throw new NotFoundError('No user found in the system');
        }

        return users;
    }

    async getUsersReference(role: UserRole = UserRole.TUTOR): Promise<Array<IDocumentReference>> {
        const users: User[] = await this.getUsers(role);

        const userReferences: IDocumentReference[] = [];

        for (const user of users) {
            const userEntity = user.serialize();
            const userRef = this._tutorRepository.getDocumentRef(`${COLLECTIONS.User}/${userEntity.id}`);
            userReferences.push(userRef);
        }

        return userReferences;
    }
}
