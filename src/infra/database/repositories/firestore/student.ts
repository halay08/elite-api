import { provide } from 'inversify-binding-decorators';
import { Student } from '@/domain';
import { StudentMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { IStudentRepository } from '../interfaces';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IStudentEntity } from '@/domain/types';

@provide(TYPES.StudentRepository)
export class StudentRepository extends BaseRepository<Student> implements IStudentRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollection() {
        return COLLECTIONS.Student;
    }

    /**
     * Map fields to domain entity
     * @param value Entity raw field
     * @returns domain
     */
    protected toDomain(value: Student): Student {
        return StudentMapper.toDomain(value);
    }

    /**
     * Serialize domain entity
     * @param value Entity object
     * @returns serialize
     */
    protected serialize(value: Student): IStudentEntity {
        return value.serialize();
    }
}
