import { inject } from 'inversify';
import TYPES from '@/src/types';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { Student } from '@/domain';
import { IStudentEntity, UserRole } from '@/domain/types';
import { StudentService } from '@/src/app/services';
import { BaseSeeding } from './base';

@provide(TYPES.StudentSeeding)
export class StudentSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.StudentService)
    private readonly studentService: StudentService;

    async run() {
        const userReferences = await this.getUserReferences(UserRole.STUDENT);

        const students: IStudentEntity[] = [
            {
                id: userReferences[0].id,
                user: userReferences[0],
                studyTitle: '',
                studyPlace: '',
                jobTitle: 'Software Developer',
                jobPlace: 'Da Nang, Viet Nam',
                followings: []
            },
            {
                id: userReferences[1].id,
                user: userReferences[1],
                studyTitle: 'Student',
                studyPlace: 'Da Nang, Viet Nam',
                jobTitle: 'Software Developer',
                jobPlace: 'Da Nang, Viet Nam',
                followings: []
            }
        ];

        for (const student of students) {
            const existedStudent = await this.studentService.getById(`${student.id}`);
            if (existedStudent) {
                console.log(`Student ${student.id} already existed in the database`);
                continue;
            }

            const model: Student = Student.create(student);
            const newStudent = await this.studentService.create(model);
            const studentEntity = newStudent.serialize();
            console.log(`New student was created ${studentEntity.id}`);
        }

        console.log('DONE!');
    }
}
