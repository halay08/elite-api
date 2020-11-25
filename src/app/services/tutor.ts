//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { provide } from 'inversify-binding-decorators';
import { Tutor } from '@/domain';
import { IRepository, ITutorRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';

@provide(TYPES.TutorService)
export class TutorService extends BaseService<Tutor> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Tutor> {
        return Container.get<ITutorRepository>(TYPES.TutorRepository);
    }
}
