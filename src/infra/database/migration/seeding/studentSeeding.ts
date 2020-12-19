import { inject } from 'inversify';
import TYPES from '@/src/types';
import { IStudentRepository, IUserRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { User, Student } from '@/domain';
import { NotFoundError } from '@/src/app/errors';
import { UserRole, IStudentEntity } from '@/domain/types';
import { IDocumentReference } from '../../types';

@provide(TYPES.StudentSeeding)
class StudentSeeding implements ISeeding {
    constructor(
        @inject(TYPES.StudentRepository)
        private readonly _studentRepository: IStudentRepository,
        @inject(TYPES.UserRepository)
        private readonly _userRepository: IUserRepository
    ) {}

    /**
     * Get the first user to embed to tutor
     */
    private async _getUser(): Promise<User[]> {
        const users = await this._userRepository.query([{ role: UserRole.STUDENT, operator: '==' }], { limit: 10 });

        if (users.length === 0) {
            throw new NotFoundError('No user found in the system');
        }

        return users;
    }

    async run() {
        const users: User[] = await this._getUser();

        const userReferences: IDocumentReference[] = [];

        for (const user of users) {
            const userEntity = user.serialize();
            const userRef = this._studentRepository.getDocumentRef(`users/${userEntity.id}`);
            userReferences.push(userRef);
        }

        const students: IStudentEntity[] = [
            {
                user: userReferences[0],
                studyTitle: 'Marketing',
                studyPlace: 'Sai Gon',
                jobTitle: 'Elite',
                jobPlace: 'Da Nang'
            },
            {
                user: userReferences[1],
                studyTitle: 'Information Technology',
                studyPlace: 'DUT',
                jobTitle: 'Elite',
                jobPlace: 'Da Nang'
            }
        ];

        for (const student of students) {
            const existedStudent = await this._studentRepository.findBy('user', student.user);
            if (existedStudent.length > 0) {
                console.log(`Student with user ${student.user.id} already existed in the database`);
                continue;
            }

            const model: Student = Student.create(student);
            const newStudent = await this._studentRepository.create(model);
            const studentEntity = newStudent.serialize();
            console.log(`New student was created ${studentEntity.id}`);
        }

        console.log('DONE!');
    }
}

export default StudentSeeding;
