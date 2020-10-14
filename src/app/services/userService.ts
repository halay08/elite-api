import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import { User } from '@/domain/user';
import { IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';

@provide(TYPES.UserService)
export default class UserService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository
    ) {}

    public async getUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async getUser(id: string): Promise<User> {
        return await this.userRepository.findById(id);
    }

    public async newUser(user: User): Promise<string> {
        return await this.userRepository.create(user);
    }

    public async updateUser(id: string, user: User): Promise<string> {
        return await this.userRepository.update(id, user);
    }

    public async deleteUser(id: string): Promise<string> {
        return await this.userRepository.delete(id);
    }
}
