import { inject } from 'inversify';
import TYPES from '@/src/types';
import { IStudentRepository, IUserRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { User, Student } from '@/domain';
import { NotFoundError } from '@/src/app/errors';
import { IStudentEntity, UserRole } from '@/domain/types';
import { IDocumentReference } from '../../types';
import { COLLECTIONS } from '../../config/collection';

@provide(TYPES.StudentSeeding)
export class StudentSeeding implements ISeeding {
    constructor(
        @inject(TYPES.StudentRepository)
        private readonly studentRepository: IStudentRepository,
        @inject(TYPES.UserRepository)
        private readonly userRepository: IUserRepository
    ) {}

    /**
     * Get the user to embed to student
     */
    private async getUsers(): Promise<User[]> {
        const users = await this.userRepository.query([{ role: UserRole.STUDENT, operator: '==' }], { limit: 2 });

        if (users.length === 0) {
            throw new NotFoundError('No user found in the system');
        }

        return users;
    }

    async run() {
        const users: User[] = await this.getUsers();
        const userReferences: IDocumentReference[] = [];

        for (const user of users) {
            const userEntity = user.serialize();
            const userRef = this.studentRepository.getDocumentRef(`${COLLECTIONS.User}/${userEntity.id}`);
            userReferences.push(userRef);
        }

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
