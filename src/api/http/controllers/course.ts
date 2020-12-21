import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    interfaces,
    response,
    requestParam,
    queryParam
} from 'inversify-express-utils';
import TYPES from '@/src/types';
import { SessionService, CourseService } from '@/src/app/services';
import { authorize } from '@/api/http/middlewares';
import { NotFoundError } from '@/app/errors';
import { ISessionQueryParam } from '../requests';
import { UserRole } from '@/src/domain/types';

// Required login
@controller(`/courses`, authorize({ roles: [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT] }))
export class CourseController extends BaseHttpController implements interfaces.Controller {
    constructor(
        @inject(TYPES.SessionService) private sessionService: SessionService,
        @inject(TYPES.CourseService) private courseService: CourseService
    ) {
        super();
    }
    /**
     * Https get sessions by course id
     * Postman API document: https://elitework.postman.co
     * @param id
     * @param queries Query string to filter session.
     * @param res
     * @returns
     */
    @httpGet('/:id/sessions')
    public async getSessions(
        @requestParam('id') id: string,
        @queryParam() queries: ISessionQueryParam,
        @response() res: Response
    ) {
        try {
            const sessions = await this.sessionService.getByCourses(id, queries);

            return res.status(HttpStatus.OK).json(sessions.map((s) => s.serialize()));
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }

    /**
     *
     * @api {GET} /courses/:id Get course by id.
     * @apiGroup Course
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "Authorization": "dsfsdkfhjks2904820493204930-sdflskjd"
     * }
     *
     * @apiSuccess (200) {Object} Info of course
     * @apiSuccessExample {Object} Success-Response:
     * {
     * 		"id": "yXFPHUt5LDvmbfxUSJF5",
     * 		"type": "full",
     * 		"name": "Intensive Spoken English for Beginners",
     * 		"slug": "intensive-english-course-for-beginners",
     * 		"presentationLanguage": {
     * 				"code": "en",
     * 				"name": "English"
     * 		},
     * 		"description": "You will learn over 1000 vital English words, expressions and idioms, and how to use them in real life.",
     * 		"benefits": [
     * 				"Professional",
     * 				"Email Writing",
     * 				"Presentation",
     * 				"Writing"
     * 		],
     * 		"detailContent": "<p>Your most powerful and intensive online English</p>",
     * 		"requirements": [
     * 				"Laptop/PC",
     * 				"Webcame",
     * 				"Microphone"
     * 		],
     * 		"policy": {
     * 				"freeFirstCourse": true,
     * 				"cancelBeforeStarting": {
     * 						"allow": true,
     * 						"refundPercent": 50,
     * 						"condition": 24
     * 				},
     * 				"cancelSessionBeforeStarting": {
     * 						"allow": true,
     * 						"refundPercent": 50,
     * 						"condition": 24
     * 				},
     * 				"cancelInProgress": {
     * 						"allow": true,
     * 						"refundPercent": 40,
     * 						"condition": 2
     * 				},
     * 				"cancelSessionInProgress": {
     * 						"allow": true,
     * 						"refundPercent": 50,
     * 						"condition": 24
     * 				}
     * 		},
     * 		"tutor": {
     * 				"expertises": [
     * 						"Speaking",
     * 						"Listening",
     * 						"Grammar"
     * 				],
     * 				"educations": [
     * 						{
     * 								"endDate": {
     * 										"_seconds": 1640099099,
     * 										"_nanoseconds": 712000000
     * 								},
     * 								"isPresentLearning": true,
     * 								"location": "Da Nang, Vietnam",
     * 								"schoolName": "Elite School",
     * 								"startDate": {
     * 										"_seconds": 1608563099,
     * 										"_nanoseconds": 712000000
     * 								}
     * 						}
     * 				],
     * 				"contracts": [],
     * 				"deletedAt": null,
     * 				"followers": 22,
     * 				"activeStatus": 1,
     * 				"certificates": [
     * 						{
     * 								"description": "",
     * 								"url": "https://www.iibc-global.org/library/default/english/toeic/test/lr/guide05/guide05_01/img/en_guide04_02_02n3.jpg",
     * 								"name": "TOEIC 900",
     * 								"status": "verified"
     * 						},
     * 						{
     * 								"description": "",
     * 								"url": "https://fn.vinhphuc.edu.vn/UploadImages/gdtxtinh/IIG.png?w=2000",
     * 								"name": "TOEFL ITP",
     * 								"status": "verified"
     * 						}
     * 				],
     * 				"reviews": 8,
     * 				"happyUsers": 130,
     * 				"category": {
     * 						"deletedAt": null,
     * 						"name": "English",
     * 						"slug": "english",
     * 						"id": "sNQjPoNk5Ep4Ub8S4Yh3",
     * 						"createdAt": {
     * 								"_seconds": 1608563099,
     * 								"_nanoseconds": 684030000
     * 						},
     * 						"updatedAt": {
     * 								"_seconds": 1608563099,
     * 								"_nanoseconds": 684030000
     * 						}
     * 				},
     * 				"user": {
     * 						"country": {
     * 								"code": "vn",
     * 								"name": "Vietnam"
     * 						},
     * 						"role": "tutor",
     * 						"timezone": "+7",
     * 						"videoIntro": "https://www.youtube.com/watch?v=tKboZuXfozo",
     * 						"language": {
     * 								"code": "vn",
     * 								"name": "Vietnam"
     * 						},
     * 						"avatar": "https://ca.slack-edge.com/T018R4JFELS-U018R4LGE3U-gec3bfccc13a-512",
     * 						"shortIntro": "Lorem ipsum dolor sit amet",
     * 						"deletedAt": null,
     * 						"phoneNumber": "0988795915",
     * 						"name": "Truong Vu",
     * 						"email": "vukhanhtruong@gmail.com",
     * 						"status": 1,
     * 						"username": "truongvu",
     * 						"id": "jH9KUHxrQvkTnzpvbnGd",
     * 						"createdAt": {
     * 								"_seconds": 1608563099,
     * 								"_nanoseconds": 613856000
     * 						},
     * 						"updatedAt": {
     * 								"_seconds": 1608563099,
     * 								"_nanoseconds": 613856000
     * 						}
     * 				},
     * 				"id": "gSuNV8HgLRXYceyf6abx",
     * 				"createdAt": {
     * 						"_seconds": 1608563099,
     * 						"_nanoseconds": 776573000
     * 				},
     * 				"updatedAt": {
     * 						"_seconds": 1608563099,
     * 						"_nanoseconds": 776573000
     * 				}
     * 		},
     * 		"sessions": [],
     * 		"status": 0,
     * 		"createdAt": {
     * 				"_seconds": 1608563099,
     * 				"_nanoseconds": 931976000
     * 		},
     * 		"updatedAt": {
     * 				"_seconds": 1608563099,
     * 				"_nanoseconds": 931976000
     * 		},
     * 		"deletedAt": null,
     * 		"totalCost": 250
     * }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "something went wrong"
     *   }
     *
     * @apiError UNAUTHORIZED Return Error Message.
     * @apiErrorExample {String} Error-Response:
     *   Error 401: Unauthorized
     *   Unauthorized
     */
    @httpGet('/:id')
    public async index(@requestParam('id') id: string, @response() res: Response) {
        try {
            const course = await this.courseService.findDetailById(id);

            if (!course) {
                throw new NotFoundError('Course is not found');
            }

            return res.status(HttpStatus.OK).json(course);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }
}
