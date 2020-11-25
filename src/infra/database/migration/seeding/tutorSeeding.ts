import { inject } from 'inversify';
import TYPES from '@/src/types';
import { ICategoryRepository, ITutorRepository, IUserRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import ISeeding from './seedingInterface';
import { Category, User, Tutor } from '@/domain';
import { NotFoundError } from '@/src/app/errors';
import { ITutorEntity, TutorStatus, CertificateStatus, UserRole } from '@/domain/types';
import { time } from '@/app/helpers';
import { IDocumentReference } from '../../types';

@provide(TYPES.TutorSeeding)
class TutorSeeding implements ISeeding {
    constructor(
        @inject(TYPES.CategoryRepository)
        private readonly _categoryRepository: ICategoryRepository,
        @inject(TYPES.TutorRepository)
        private readonly _tutorRepository: ITutorRepository,
        @inject(TYPES.UserRepository)
        private readonly _userRepository: IUserRepository
    ) {}

    /**
     * Get the first category to embed to tutor
     */
    private async _getCategory(): Promise<Category> {
        const categories = await this._categoryRepository.query([], { limit: 1 });

        if (categories.length === 0) {
            throw new NotFoundError('No category found in the system');
        }

        return categories[0];
    }

    /**
     * Get the first user to embed to tutor
     */
    private async _getUser(): Promise<User[]> {
        const users = await this._userRepository.query([{ role: UserRole.TUTOR, operator: '==' }], { limit: 10 });

        if (users.length === 0) {
            throw new NotFoundError('No user found in the system');
        }

        return users;
    }

    async run() {
        const users: User[] = await this._getUser();
        const category: Category = await this._getCategory();

        const userReferences: IDocumentReference[] = [];

        for (const user of users) {
            const userEntity = user.serialize();
            const userRef = this._tutorRepository.getDocumentRef(`users/${userEntity.id}`);
            userReferences.push(userRef);
        }

        const categoryEntity = category.serialize();
        const categoryRef = this._categoryRepository.getDocumentRef(`categories/${categoryEntity.id}`);

        const tutors: ITutorEntity[] = [
            {
                user: userReferences[0],
                category: categoryRef,
                activeStatus: TutorStatus.ACTIVE,
                educations: [
                    {
                        startDate: time.getCurrentUTCDate(),

                        endDate: time.addDate(undefined, 365),

                        isPresentLearning: true,

                        schoolName: 'Elite School',

                        location: 'Da Nang, Vietnam'
                    }
                ],
                expertises: ['Speaking', 'Listening', 'Grammar'],
                certificates: [
                    {
                        name: 'TOEIC 900',
                        url:
                            'https://www.iibc-global.org/library/default/english/toeic/test/lr/guide05/guide05_01/img/en_guide04_02_02n3.jpg',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    },
                    {
                        name: 'TOEFL ITP',
                        url: 'https://fn.vinhphuc.edu.vn/UploadImages/gdtxtinh/IIG.png?w=2000',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    }
                ],
                contracts: [],
                followers: 39,
                happyUsers: 141,
                reviews: 12
            },
            {
                user: userReferences[1],
                category: categoryRef,
                activeStatus: TutorStatus.ACTIVE,
                educations: [
                    {
                        startDate: time.getCurrentUTCDate(),

                        endDate: time.addDate(undefined, 365),

                        isPresentLearning: true,

                        schoolName: 'Elite School',

                        location: 'Da Nang, Vietnam'
                    }
                ],
                expertises: ['Speaking', 'Listening', 'Grammar'],
                certificates: [
                    {
                        name: 'TOEIC 900',
                        url:
                            'https://www.iibc-global.org/library/default/english/toeic/test/lr/guide05/guide05_01/img/en_guide04_02_02n3.jpg',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    },
                    {
                        name: 'TOEFL ITP',
                        url: 'https://fn.vinhphuc.edu.vn/UploadImages/gdtxtinh/IIG.png?w=2000',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    }
                ],
                contracts: [],
                followers: 22,
                happyUsers: 130,
                reviews: 8
            },
            {
                user: userReferences[2],
                category: categoryRef,
                activeStatus: TutorStatus.ACTIVE,
                educations: [
                    {
                        startDate: time.getCurrentUTCDate(),

                        endDate: time.addDate(undefined, 365),

                        isPresentLearning: true,

                        schoolName: 'Elite School',

                        location: 'Da Nang, Vietnam'
                    }
                ],
                expertises: ['Listening', 'Grammar'],
                certificates: [
                    {
                        name: 'TOEIC 800',
                        url:
                            'https://www.iibc-global.org/library/default/english/toeic/test/lr/guide05/guide05_01/img/en_guide04_02_02n3.jpg',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    },
                    {
                        name: 'TOEFL ITP',
                        url: 'https://fn.vinhphuc.edu.vn/UploadImages/gdtxtinh/IIG.png?w=2000',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    }
                ],
                contracts: [],
                followers: 17,
                happyUsers: 56,
                reviews: 20
            },
            {
                user: userReferences[3],
                category: categoryRef,
                activeStatus: TutorStatus.ACTIVE,
                educations: [
                    {
                        startDate: time.getCurrentUTCDate(),

                        endDate: time.addDate(undefined, 365),

                        isPresentLearning: true,

                        schoolName: 'Elite School',

                        location: 'Da Nang, Vietnam'
                    }
                ],
                expertises: ['Grammar', 'Communication'],
                certificates: [
                    {
                        name: 'TOEIC 900',
                        url:
                            'https://www.iibc-global.org/library/default/english/toeic/test/lr/guide05/guide05_01/img/en_guide04_02_02n3.jpg',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    },
                    {
                        name: 'TOEFL ITP',
                        url: 'https://fn.vinhphuc.edu.vn/UploadImages/gdtxtinh/IIG.png?w=2000',
                        description: '',
                        status: CertificateStatus.VERIFIED
                    }
                ],
                contracts: [],
                followers: 191,
                happyUsers: 256,
                reviews: 104
            }
        ];

        for (const tutor of tutors) {
            const existedTutor = await this._tutorRepository.findBy('user.id', tutor.user.id);
            if (existedTutor.length > 0) {
                console.log(`Tutor with user ${tutor.user.id} already existed in the database`);
                continue;
            }

            const tutorModel: Tutor = Tutor.create(tutor);
            const newTutor = await this._tutorRepository.create(tutorModel);
            const tutorEntity = newTutor.serialize();
            console.log(`New tutor was created ${tutorEntity.id}`);
        }

        console.log('DONE!');
    }
}

export default TutorSeeding;
