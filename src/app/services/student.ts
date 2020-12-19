import { provide } from 'inversify-binding-decorators';
import { Student } from '@/domain';
import { IRepository, IStudentRepository } from '@/src/infra/database/repositories';
import TYPES from '@/src/types';
import { BaseService } from './base';
import Container from '@/src/container';
import { IStudentEntity } from '@/src/domain/types';
import { UpdateStudentPayload } from '@/src/api/http/requests/student';
import { NotFoundError } from '../errors';

@provide(TYPES.StudentService)
export class StudentService extends BaseService<Student> {
    /**
     * Create student repository instance
     * @returns IRepository<T>
     */
    protected getBaseRepositoryInstance(): IRepository<Student> {
        return Container.get<IStudentRepository>(TYPES.StudentRepository);
    }

    /**
     * Get by id.
     *
     * @param id The tutor id
     * @returns `Student` object
     */
    async getByUserId(id: string): Promise<Student> {
        const userRef = this.getDocumentRef(`users/${id}`);
        const [student] = await this.findBy('user', userRef);

        if (!student) {
            throw new NotFoundError('Student not found');
        }
        return student;
    }

    /**
     * Updates student service
     * @param id
     * @param studentPayload
     * @returns updated
     */
    async updateByUserId(id: string, studentPayload: UpdateStudentPayload): Promise<Student> {
        const userRef = this.getDocumentRef(`users/${id}`);
        const student = await this.getByUserId(id);

        const studentEntity: IStudentEntity = student.serialize();

        const studentData: Student = Student.create({ user: userRef, ...studentPayload });
        const updated = await this.baseRepository.update(studentEntity.id || '', studentData);
        return updated;
    }

    /**
     * Creates student.
     * @param id User id
     * @returns created
     */
    async createByUserId(id: string): Promise<Student> {
        const userRef = this.getDocumentRef(`users/${id}`);
        const [existed] = await this.findBy('user', userRef);
        if (existed) {
            return existed;
        }

        const student: Student = Student.create({ user: userRef });
        const created = await this.create(student);
        return created;
    }
}
