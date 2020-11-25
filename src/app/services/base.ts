//@ts-ignore
import * as isEmpty from 'ramda.isempty';
import { injectable } from 'inversify';
import { IRepository } from '@/src/infra/database/repositories';
import { IDocumentReference, IQuery, IQueryOption } from '@/src/infra/database/types';
import { admin } from '@/src/firebase.config';

@injectable()
export abstract class BaseService<T> {
    protected baseRepository: IRepository<T>;

    /**
     * Creates an instance of base service.
     */
    constructor() {
        this.baseRepository = this.getBaseRepositoryInstance();
    }

    /**
     * Create base repository instance
     * @returns IRepository<T>
     */
    protected abstract getBaseRepositoryInstance(): IRepository<T>;

    /**
     * Get reference document by path
     * @param path Path of reference document, ex: users/tygD3iFGr42DfZs4sz
     * @returns IDocumentReference
     */
    getDocumentRef(path: string): IDocumentReference {
        return admin.firestore().doc(path);
    }

    /**
     * Gets all
     * @returns all
     */
    async getAll(): Promise<T[]> {
        return await this.baseRepository.findAll();
    }

    /**
     * Querys base service
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IQuery<T>[] = [], options: Partial<IQueryOption<T>> = {}): Promise<T[]> {
        return await this.baseRepository.query(queries, options);
    }

    /**
     * Find record by field and value.
     *
     * @param field The query field
     * @param value The query value
     */
    async findBy(field: string, value: any): Promise<T[]> {
        const query = await this.baseRepository.findBy(field, value);
        return query;
    }

    /**
     * Get by id.
     *
     * @param id The tutor id
     * @returns `Tutor` object
     */
    async getById(id: string): Promise<T> {
        return await this.baseRepository.findById(id);
    }

    /**
     * Creates tutor service
     * @param tutor
     * @returns create
     */
    async create(tutor: T): Promise<T> {
        const inserted = await this.baseRepository.create(tutor);
        return inserted;
    }

    /**
     * Updates tutor service
     * @param id
     * @param tutor
     * @returns update
     */
    async update(id: string, tutor: T): Promise<T> {
        const updated = await this.baseRepository.update(id, tutor);
        return updated;
    }

    /**
     * Deletes tutor service
     * @param id
     * @param [softDelete]
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return await this.baseRepository.delete(id, softDelete);
    }
}
