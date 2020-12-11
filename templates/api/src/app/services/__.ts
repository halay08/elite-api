import { provide } from 'inversify-binding-decorators';
import { #### } from '@/domain';
import { IRepository, I####Repository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';

@provide(TYPES.####Service)
export class ####Service extends BaseService<####> {
    /**
     * Create tutor repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<####> {
        return Container.get<I####Repository>(TYPES.####Repository);
    }
}
