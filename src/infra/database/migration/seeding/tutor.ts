import { inject } from 'inversify';
import TYPES from '@/src/types';
import { ICategoryRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { Category, Tutor } from '@/domain';
import { NotFoundError } from '@/src/app/errors';
import { ITutorEntity, TutorStatus, CertificateStatus } from '@/domain/types';
import * as time from '@/app/helpers';
import { TutorService } from '@/src/app/services';
import { BaseSeeding } from './base';

@provide(TYPES.TutorSeeding)
export class TutorSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository;

    @inject(TYPES.TutorService)
    private readonly tutorService: TutorService;

    /**
     * Get the category to embed to the tutor
     */
    private async getCategory(): Promise<Category> {
        const categories = await this.categoryRepository.query([], { limit: 1 });

        if (categories.length === 0) {
            throw new NotFoundError('No category found in the system');
        }

        return categories[0];
    }

    async run() {
        const userReferences = await this.getUserReferences();
        const category: Category = await this.getCategory();

        const categoryEntity = category.serialize();
        const categoryRef = this.categoryRepository.getDocumentRef(`${categoryEntity.id}`);

        const tutors: ITutorEntity[] = [
            {
                id: userReferences[0].id,
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
                id: userReferences[1].id,
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
                id: userReferences[2].id,
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
                id: userReferences[3].id,
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
            const existedTutor = await this.tutorService.getById(`${tutor.id}`);
            if (existedTutor) {
                console.log(`Tutor ${tutor.id} already existed in the database`);
                continue;
            }

            const tutorModel: Tutor = Tutor.create(tutor);
            const newTutor = await this.tutorService.create(tutorModel);
            const tutorEntity = newTutor.serialize();
            console.log(`New tutor was created ${tutorEntity.id}`);
        }

        console.log('DONE!');
    }
}
