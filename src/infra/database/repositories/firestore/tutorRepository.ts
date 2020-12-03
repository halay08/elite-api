import { provide } from 'inversify-binding-decorators';
import { Tutor } from '@/domain';
import { TutorMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ITutorRepository } from '../tutorRepositoryInterface';
import BaseRepository from './baseRepository';
import { IQueryOption } from '@/infra/database/types';
import { IFirestoreQuery } from '../../firestore/types';
import { NotFoundError } from '@/app/errors';

@provide(TYPES.TutorRepository)
export class TutorRepository extends BaseRepository<Tutor> implements ITutorRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return 'tutors';
    }

    /**
     * Querys tutor records
     * @template Tutor
     * @param [queries]
     * @param [options]
     * @returns query
     */
    async query(queries: IFirestoreQuery<Tutor>[] = [], options: Partial<IQueryOption<Tutor>> = {}): Promise<Tutor[]> {
        const docs = await this.collection.query(queries, options);
        return docs.map((item) => TutorMapper.toDomain(item));
    }

    /**
     * Finds all
     * @returns all
     */
    async findAll(): Promise<Tutor[]> {
        const tutors = await this.collection.findAll();
        return tutors.map((item) => TutorMapper.toDomain(item));
    }

    /**
     * Finds by id
     * @param id
     * @returns by id
     */
    async findById(id: string): Promise<Tutor> {
        const tutor = await this.collection.findById(id);
        if (!tutor) {
            throw new NotFoundError('Tutor not found');
        }

        return TutorMapper.toDomain(tutor);
    }

    /**
     * Creates tutor record
     * @param tutor
     * @returns create
     */
    async create(tutorModel: Tutor): Promise<Tutor> {
        const dto = tutorModel.serialize();
        const { id } = dto;

        if (id) {
            await this.collection.set(id, dto);
            return this.findById(id);
        }

        const user = await this.collection.create(dto);
        return this.findById(user.id);
    }

    /**
     * Updates tutor record
     * @param id
     * @param user
     * @returns update
     */
    async update(id: string, tutor: Tutor): Promise<Tutor> {
        const dto = tutor.serialize();
        await this.collection.update(id, dto);

        return this.findById(id);
    }

    /**
     * Deletes tutor record
     * @param id
     * @returns delete
     */
    async delete(id: string, softDelete: boolean = true): Promise<number> {
        return (await this.collection.delete(id, softDelete)).writeTime.seconds;
    }
}
