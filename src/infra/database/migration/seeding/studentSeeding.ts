import { inject } from 'inversify';
import TYPES from '@/src/types';
import { IStudentRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { Student } from '@/domain';
import { IStudentEntity, UserRole } from '@/domain/types';
import { BaseSeeding } from './baseSeeding';

@provide(TYPES.StudentSeeding)
export class StudentSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.StudentRepository)
    private readonly studentRepository: IStudentRepository;

    async run() {
        const userReferences = await this.getUserReferences(UserRole.STUDENT);

        const students: IStudentEntity[] = [
            {
                user: userReferences[0],
                studyTitle: '',
                studyPlace: '',
                jobTitle: 'Software Developer',
                jobPlace: 'Da Nang, Viet Nam',
                followings: []
            },
            {
                user: userReferences[1],
                studyTitle: 'Student',
                studyPlace: 'Da Nang, Viet Nam',
                jobTitle: 'Software Developer',
                jobPlace: 'Da Nang, Viet Nam',
                followings: []
            }
        ];

        for (const student of students) {
            const existedStudent = await this.studentRepository.findBy('user', student.user);
            if (existedStudent.length > 0) {
                console.log(`Student with user ${student.user.id} already existed in the database`);
                continue;
            }

            const model: Student = Student.create(student);
            const newStudent = await this.studentRepository.create(model);
            const studentEntity = newStudent.serialize();
            console.log(`New student was created ${studentEntity.id}`);
        }

        console.log('DONE!');
    }
}
