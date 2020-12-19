import { provide } from 'inversify-binding-decorators';
import { Student } from '@/domain';
import TYPES from '@/src/types';
import { IStudentRepository } from '../interfaces/student';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { IStudentEntity } from '@/domain/types';
import { StudentMapper } from '../../mappers/student';

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
     * @param student Entity raw field
     * @returns domain
     */
    protected toDomain(student: Student): Student {
        return StudentMapper.toDomain(student);
    }

    /**
     * Serialize domain entity
     * @param data Entity object
     * @returns serialize
     */
    protected serialize(data: Student): IStudentEntity {
        return data.serialize();
    }
}
