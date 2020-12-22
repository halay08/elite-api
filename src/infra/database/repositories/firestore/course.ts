import { provide } from 'inversify-binding-decorators';
import { Course } from '@/domain';
import { CourseMapper } from '@/infra/database/mappers';
import TYPES from '@/src/types';
import { ICourseRepository } from '../interfaces/course';
import { BaseRepository } from './base';
import { COLLECTIONS } from '../../config/collection';
import { ICourseEntity } from '@/src/domain/types';

@provide(TYPES.CourseRepository)
export class CourseRepository extends BaseRepository<Course> implements ICourseRepository {
    /**
     * Gets collection
     * @returns
     */
    getCollectionName() {
        return COLLECTIONS.Course;
    }

    /**
     * Map fields to domain entity
     * @param course Entity raw field
     * @returns domain
     */
    protected toDomain(course: Course): Course {
        return CourseMapper.toDomain(course);
    }

    /**
     * Serialize domain entity
     * @param course Entity object
     * @returns serialize
     */
    protected serialize(course: Course): ICourseEntity {
        return course.serialize();
    }
}
