import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, response, interfaces, requestParam } from 'inversify-express-utils';
import { SessionService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';

@controller(`/sessions`, authorize({ roles: ['admin', 'student', 'tutor'] }))
export class SessionController extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.SessionService) private sessionService: SessionService) {
        super();
    }

    /**
     *
     * @api {GET} /sessions/:id Get session by id.
     * @apiGroup Session
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization User's access key.
     * @apiHeaderExample {json} Header-Example:
     * {
     *   "Authorization": "dsfsdkfhjks2904820493204930-sdflskjd"
     * }
     *
     * @apiSuccess (200) {Object} Info of session
     * @apiSuccessExample {Object} Success-Response:
     * {
     *     "id": "0pqLSmu9T3FnolpQIUti",
     *     "name": "Building Your English Brain lesson 1",
     *     "slug": "building-your-english-brain-lesson-1",
     *     "course": {
     *         "benefits": [
     *             "Professional",
     *             "Email Writing",
     *             "Presentation",
     *             "Writing"
     *         ],
     *         "sessions": [],
     *         "requirements": [
     *             "Laptop/PC",
     *             "Webcame",
     *             "Microphone"
     *         ],
     *         "description": "You will learn over 1000 vital English words",
     *         "type": "full",
     *         "presentationLanguage": {
     *             "code": "en",
     *             "name": "English"
     *         },
     *         "tutor": {
     *             "expertises": [
     *                 "Speaking",
     *                 "Listening",
     *                 "Grammar"
     *             ],
     *             "educations": [
     *                 {
     *                     "endDate": {
     *                         "_seconds": 1640099099,
     *                         "_nanoseconds": 712000000
     *                     },
     *                     "isPresentLearning": true,
     *                     "location": "Da Nang, Vietnam",
     *                     "schoolName": "Elite School",
     *                     "startDate": {
     *                         "_seconds": 1608563099,
     *                         "_nanoseconds": 712000000
     *                     }
     *                 }
     *             ],
     *             "contracts": [],
     *             "deletedAt": null,
     *             "followers": 22,
     *             "activeStatus": 1,
     *             "certificates": [
     *                 {
     *                     "description": "",
     *                     "url": "https://www.iibc-global.org/library/default/english/toeic/test/lr/guide05/guide05_01/img/en_guide04_02_02n3.jpg",
     *                     "name": "TOEIC 900",
     *                     "status": "verified"
     *                 },
     *                 {
     *                     "description": "",
     *                     "url": "https://fn.vinhphuc.edu.vn/UploadImages/gdtxtinh/IIG.png?w=2000",
     *                     "name": "TOEFL ITP",
     *                     "status": "verified"
     *                 }
     *             ],
     *             "reviews": 8,
     *             "happyUsers": 130,
     *             "category": {
     *                 "deletedAt": null,
     *                 "name": "English",
     *                 "slug": "english",
     *                 "id": "sNQjPoNk5Ep4Ub8S4Yh3",
     *                 "createdAt": {
     *                     "_seconds": 1608563099,
     *                     "_nanoseconds": 684030000
     *                 },
     *                 "updatedAt": {
     *                     "_seconds": 1608563099,
     *                     "_nanoseconds": 684030000
     *                 }
     *             },
     *             "user": {
     *                 "country": {
     *                     "code": "vn",
     *                     "name": "Vietnam"
     *                 },
     *                 "role": "tutor",
     *                 "timezone": "+7",
     *                 "videoIntro": "https://www.youtube.com/watch?v=tKboZuXfozo",
     *                 "language": {
     *                     "code": "vn",
     *                     "name": "Vietnam"
     *                 },
     *                 "avatar": "https://ca.slack-edge.com/T018R4JFELS-U018R4LGE3U-gec3bfccc13a-512",
     *                 "shortIntro": "Lorem ipsum dolor sit amet",
     *                 "deletedAt": null,
     *                 "phoneNumber": "0988795915",
     *                 "name": "Truong Vu",
     *                 "email": "vukhanhtruong@gmail.com",
     *                 "status": 1,
     *                 "username": "truongvu",
     *                 "id": "jH9KUHxrQvkTnzpvbnGd",
     *                 "createdAt": {
     *                     "_seconds": 1608563099,
     *                     "_nanoseconds": 613856000
     *                 },
     *                 "updatedAt": {
     *                     "_seconds": 1608563099,
     *                     "_nanoseconds": 613856000
     *                 }
     *             },
     *             "id": "gSuNV8HgLRXYceyf6abx",
     *             "createdAt": {
     *                 "_seconds": 1608563099,
     *                 "_nanoseconds": 776573000
     *             },
     *             "updatedAt": {
     *                 "_seconds": 1608563099,
     *                 "_nanoseconds": 776573000
     *             }
     *         },
     *         "detailContent": "<p>Your most powerful and intensive online English language course</p>",
     *         "deletedAt": null,
     *         "name": "Intensive Spoken English for Beginners",
     *         "slug": "intensive-english-course-for-beginners",
     *         "policy": {
     *             "freeFirstCourse": true,
     *             "cancelBeforeStarting": {
     *                 "allow": true,
     *                 "refundPercent": 50,
     *                 "condition": 24
     *             },
     *             "cancelSessionBeforeStarting": {
     *                 "allow": true,
     *                 "refundPercent": 50,
     *                 "condition": 24
     *             },
     *             "cancelInProgress": {
     *                 "allow": true,
     *                 "refundPercent": 40,
     *                 "condition": 2
     *             },
     *             "cancelSessionInProgress": {
     *                 "allow": true,
     *                 "refundPercent": 50,
     *                 "condition": 24
     *             }
     *         },
     *         "status": 0,
     *         "id": "yXFPHUt5LDvmbfxUSJF5",
     *         "createdAt": {
     *             "_seconds": 1608563099,
     *             "_nanoseconds": 931976000
     *         },
     *         "updatedAt": {
     *             "_seconds": 1608563099,
     *             "_nanoseconds": 931976000
     *         }
     *     },
     *     "startTime": {
     *         "_seconds": 1611196200,
     *         "_nanoseconds": 52000000
     *     },
     *     "duration": 60,
     *     "cost": 250,
     *     "costType": "cash",
     *     "content": "The 30-lesson per week Intensive English Course",
     *     "photos": [
     *         {
     *             "url": "https://www.elc.edu/wp-content/themes/Orion/images/dummies/general-english-courses-classmates.png",
     *             "name": "Photo 1",
     *             "slug": "photo-1"
     *         },
     *         {
     *             "url": "https://www.elc.edu/wp-content/themes/Orion/images/dummies/general-english-courses-elc-los-angeles-classroom.png",
     *             "name": "Photo 2",
     *             "slug": "photo-2"
     *         },
     *         {
     *             "url": "https://www.elc.edu/wp-content/themes/Orion/images/dummies/general-english-courses-computer-lab.png",
     *             "name": "Photo 3",
     *             "slug": "photo-3"
     *         }
     *     ],
     *     "videos": [
     *         {
     *             "url": "https://www.youtube.com/watch?v=IeaadwctbD4",
     *             "name": "Video 1",
     *             "slug": "video-1"
     *         },
     *         {
     *             "url": "https://www.youtube.com/watch?v=S2lFmQcXsM4",
     *             "name": "Video 2",
     *             "slug": "video-2"
     *         },
     *         {
     *             "url": "https://www.youtube.com/watch?v=QTd9Hu-1RH0",
     *             "name": "Video 3",
     *             "slug": "video-3"
     *         }
     *     ],
     *     "referenceDocuments": [],
     *     "booking": [],
     *     "status": "available",
     *     "createdAt": {
     *         "_seconds": 1608563100,
     *         "_nanoseconds": 180436000
     *     },
     *     "updatedAt": {
     *         "_seconds": 1608563100,
     *         "_nanoseconds": 180436000
     *     },
     *     "deletedAt": null
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
            const session = await this.sessionService.getDetailById(id);
            return res.status(HttpStatus.OK).json(session);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }
}
