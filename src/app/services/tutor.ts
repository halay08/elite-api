import { provide } from 'inversify-binding-decorators';
import { Tutor } from '@/domain';
import { IRepository, ITutorRepository, IUserRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { TutorStatus } from '@/src/domain/types';
import { inject } from 'inversify';

@provide(TYPES.TutorService)
export class TutorService extends BaseService<Tutor> {
    constructor(@inject(TYPES.UserRepository) private readonly userRepository: IUserRepository) {
        super();
    }

    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Tutor> {
        return Container.get<ITutorRepository>(TYPES.TutorRepository);
    }

    /**
     * Creates tutor.
     * @param id User id
     * @returns created
     */
    async createByUserId(id: string): Promise<Tutor> {
        const userRef = this.userRepository.getDocumentRef(id);
        const [existed] = await this.findBy('user', userRef);
        if (existed) {
            return existed;
        }

        const tutor: Tutor = Tutor.create({ user: userRef, activeStatus: TutorStatus.ACTIVE });
        const created = await this.create(tutor);
        return created;
    }
}
