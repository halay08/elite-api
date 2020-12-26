import { inject, injectable } from 'inversify';
import TYPES from '@/src/types';
import { UserRole } from '@/domain/types';
import { User } from '@/domain';
import { NotFoundError } from '@/app/errors';
import { IDocumentReference } from '../../types';
import { UserService } from '@/src/app/services';

@injectable()
export class BaseSeeding {
    @inject(TYPES.UserService)
    protected readonly userService: UserService;

    /**
     * Get the user to embed to tutor
     */
    private async getUsers(role: UserRole): Promise<User[]> {
        const users = await this.userService.query([{ role, operator: '==' }], { limit: 10 });

        if (users.length === 0) {
            throw new NotFoundError('No user found in the system');
        }

        return users;
    }

    async getUserReferences(role: UserRole = UserRole.TUTOR): Promise<Array<IDocumentReference>> {
        const users: User[] = await this.getUsers(role);

        const userReferences: IDocumentReference[] = [];

        for (const user of users) {
            const userEntity = user.serialize();
            const userRef = this.userService.getDocumentRef(`${userEntity.id}`);
            userReferences.push(userRef);
        }

        return userReferences;
    }
}
