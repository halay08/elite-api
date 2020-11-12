import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';

import User from '@/domain/user';
import { IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';

@provide(TYPES.UserService)
export default class UserService {
    constructor(
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository
    ) {}

    public async getAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }

    public async getById(id: string): Promise<User> {
        return await this.userRepository.findById(id);
    }

    public async create(user: Partial<User>): Promise<string> {
        return await this.userRepository.create(user);
    }

    public async update(id: string, user: Partial<User>): Promise<number> {
        return await this.userRepository.update(id, user);
    }

    public async delete(id: string, softDelete: boolean = true): Promise<number> {
        return await this.userRepository.delete(id, softDelete);
    }
}
