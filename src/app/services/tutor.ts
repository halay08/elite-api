//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { Tutor } from '@/domain';
import { ITutorRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { IQuery, IQueryOption } from '@/src/infra/database/types';

@provide(TYPES.TutorService)
export class TutorService {
    constructor(
        @inject(TYPES.TutorRepository)
        private readonly _tutorRepository: ITutorRepository
    ) {}

    /**
     * Gets all
     * @returns all
     */
    async getAll(): Promise<Tutor[]> {
        return await this._tutorRepository.findAll();
    }

    /**
     * Querys tutor service
     * @template Tutor
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IQuery<Tutor>[] = [], options: Partial<IQueryOption<Tutor>> = {}): Promise<Tutor[]> {
        return await this._tutorRepository.query(queries, options);
    }

    /**
     * Find tutor by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findBy(field: string, value: any): Promise<Tutor[]> {
        const query = await this._tutorRepository.findBy(field, value);
        return query;
    }

    /**
     * Get by id.
     *
     * @param id The tutor id
     * @returns `Tutor` object
     */
    async getById(id: string): Promise<Tutor> {
        return await this._tutorRepository.findById(id);
    }

    /**
     * Creates tutor service
     * @param tutor
     * @returns create
     */
    async create(tutor: Tutor): Promise<Tutor> {
        const inserted = await this._tutorRepository.create(tutor);
        return inserted;
    }

    /**
     * Updates tutor service
     * @param id
     * @param tutor
     * @returns update
     */
    async update(id: string, tutor: Tutor): Promise<Tutor> {
        const updated = await this._tutorRepository.update(id, tutor);
        return updated;
    }

    /**
     * Deletes tutor service
     * @param id
     * @param [softDelete]
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return await this._tutorRepository.delete(id, softDelete);
    }
}
