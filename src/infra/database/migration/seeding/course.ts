import { inject } from 'inversify';
import TYPES from '@/src/types';
import { ICourseRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { CourseStatus, ICoursePolicy, CourseType } from '@/domain/types';
import { Course } from '@/domain';
import { BaseSeeding } from './base';

@provide(TYPES.CourseSeeding)
export class CourseSeeding extends BaseSeeding implements ISeeding {
    @inject(TYPES.CourseRepository)
    private readonly courseRepository: ICourseRepository;

    /**
     * Gets policy
     * @returns policy
     */
    private getPolicy(): ICoursePolicy {
        return {
            freeFirstCourse: true,
            cancelBeforeStarting: {
                allow: true,
                condition: 24,
                refundPercent: 50
            },
            cancelInProgress: {
                allow: true,
                condition: 2,
                refundPercent: 40
            },
            cancelSessionBeforeStarting: {
                allow: true,
                condition: 24,
                refundPercent: 50
            },
            cancelSessionInProgress: {
                allow: true,
                condition: 24,
                refundPercent: 50
            }
        };
    }

    private async getCourseData(): Promise<Course[]> {
        const usersRef = await this.getUserReferences();

        return [
            Course.create({
                type: CourseType.FULL,
                name: 'Intensive Spoken English for Beginners',
                slug: 'intensive-english-course-for-beginners',
                presentationLanguage: { code: 'en', name: 'English' },
                description:
                    'You will learn over 1000 vital English words, expressions and idioms, and how to use them in real life.',
                benefits: ['Professional', 'Email Writing', 'Presentation', 'Writing'],
                detailContent:
                    '<p>Your <strong>most powerful and intensive online English language course</strong>.</p><p>It is a must-have <strong>English language course for complete beginners</strong> in English, who want to reach the<strong> intermediate level of spoken English</strong> language in the <strong>shortest time possible</strong>.&nbsp; </p>',
                requirements: ['Laptop/PC', 'Webcame', 'Microphone'],
                policy: this.getPolicy(),
                tutor: usersRef[0],
                sessions: [],
                status: CourseStatus.AVAILABLE
            }),
            Course.create({
                type: CourseType.FULL,
                name: 'Building Your English Brain',
                slug: 'building-your-english-brain',
                presentationLanguage: { code: 'en', name: 'English' },
                description: `If you can't think in English, you can't become totally fluent in English. That may sound a little bit strange, but it's true. Translating your language into English will keep you from being able to naturally communicate. This course will push you to use your English brain.`,
                benefits: ['Professional', 'Email Writing', 'Presentation', 'Writing', 'Communication', 'Speaking'],
                detailContent: `<p>You will be able to see my face and mouth clearly in each video lesson, and I will use a blackboard at all times.</p>
<p>Each lesson focuses on a single idea, and each is comprehensive. You can go at your own pace and should take your time, with lots of practice between videos. Replaying each lesson is highly recommended.</p>
<p>The old expression 'practice makes perfect' is not correct. In fact, it should be: 'PERFECT practice makes perfect'. That means, you can work hard and make very little progress with your spoken English, or you can work hard and smart, with this course, and make huge strides towards your English speaking goals. That's what this course is all about—working smart.</p>
`,
                requirements: ['Laptop/PC', 'Webcame', 'Microphone'],
                policy: this.getPolicy(),
                tutor: usersRef[1],
                sessions: [],
                status: CourseStatus.AVAILABLE
            })
        ];
    }

    async run() {
        const courses = await this.getCourseData();

        for (const course of courses) {
            const existedCourse = await this.courseRepository.findBy('slug', course.slug);
            if (existedCourse.length > 0) {
                console.log(`Course <${course.name}> already existed in the database`);
                continue;
            }

            const categoryModel: Course = Course.create(course.serialize());
            const newCourse = await this.courseRepository.create(categoryModel);
            const newCourseEntity = newCourse.serialize();
            console.log(`New course was created ${newCourseEntity.id}`);
        }

        console.log('DONE!');
    }
}
