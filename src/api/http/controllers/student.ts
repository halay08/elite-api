import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpGet,
    httpPut,
    interfaces,
    requestBody,
    requestParam,
    response
} from 'inversify-express-utils';
import { Student } from '@/domain/index';
import { StudentService, UserService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { UpdateStudentPayload, validateUpdate } from '../requests/student';
import { UserRole } from '@/src/domain/types';

@controller(`/students`)
export class StudentController extends BaseHttpController implements interfaces.Controller {
    constructor(
        @inject(TYPES.StudentService) private studentService: StudentService,
        @inject(TYPES.UserService) private userService: UserService
    ) {
        super();
    }

    /**
     *
     * @api {GET} /student/:id Get student by id
     * @apiGroup Student
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization Access token
     * @apiHeaderExample {json} Header-Example:
     *   {
     *      "Authorization": "Bearer sdhjfksfdhjk23903482093483290"
     *   }
     *
     * @apiParam  {String} id Id of student
     *
     * @apiSuccess (200) {Object} Student data
     * @apiSuccessExample {Object} Success-Response:
     *  {
     *      "id": "NIBPpAj9oJXn5uMvsrog",
     *      "user": {
     *          "country": {
     *              "code": "vn",
     *              "name": "Vietnam"
     *          },
     *          "role": "student",
     *          "timezone": "+7",
     *          "videoIntro": "https://www.youtube.com/watch?v=gXadLSFfRLk",
     *          "language": {
     *              "code": "vn",
     *              "name": "Vietnam"
     *          },
     *          "avatar": "https://ca.slack-edge.com/T018R4JFELS-U01B4GWNZ52-8d56e6c00be1-512",
     *          "shortIntro": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
     *          "deletedAt": null,
     *          "phoneNumber": "0123456789",
     *          "name": "Khanh Hoa",
     *          "email": "thagdet96@gmail.com",
     *          "status": 1,
     *          "username": "khanhhoa",
     *          "id": "FczXcOMojxRLA43VMKMMpXhu9ny2",
     *          "createdAt": {
     *              "_seconds": 1607766080,
     *              "_nanoseconds": 214000000
     *          },
     *          "updatedAt": {
     *              "_seconds": 1607767000,
     *              "_nanoseconds": 363000000
     *          }
     *      },
     *      "studyTitle": "Marketing",
     *      "studyPlace": "Sai Gon",
     *      "jobTitle": "Elite",
     *      "jobPlace": "Da Nang",
     *      "createdAt": {
     *          "_seconds": 1607767030,
     *          "_nanoseconds": 551000000
     *      },
     *      "updatedAt": {
     *          "_seconds": 1607767030,
     *          "_nanoseconds": 551000000
     *      },
     *      "deletedAt": null
     *  }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "Something went wrong"
     *   }
     *
     * @apiError UNAUTHORIZED Return Error Message.
     * @apiErrorExample {String} Error-Response:
     *   Error 401: Unauthorized
     *   Unauthorized
     */
    @httpGet('/:id', authorize({ roles: [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT] }))
    public async get(@requestParam('id') id: string, @response() res: Response) {
        try {
            const student: Student = await this.studentService.getByUserId(id);

            return res.status(HttpStatus.OK).json(student.serialize());
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }

    /**
     *
     * @api {PUT} /students/:id Update student
     * @apiGroup Student
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization Access token
     * @apiHeaderExample {json} Header-Example:
     *   {
     *      "Authorization": "Bearer sdhjfksfdhjk23903482093483290"
     *   }
     *
     * @apiParam  {String} id Id
     * @apiParam  {String} studyTitle What student study
     * @apiParam  {String} studyPlace Where student study at
     * @apiParam  {String} jobTitle What student work
     * @apiParam  {String} jobPlace Where student work at
     * @apiParam  {String} shortIntro Short introduction
     *
     * @apiSuccess (200) {Object} New data updated
     * @apiSuccessExample {Object} Success-Response:
     * {
     *      "id": "NIBPpAj9oJXn5uMvsrog",
     *      "user": {
     *          "country": {
     *              "code": "vn",
     *              "name": "Vietnam"
     *          },
     *          "role": "student",
     *          "timezone": "+7",
     *          "videoIntro": "https://www.youtube.com/watch?v=gXadLSFfRLk",
     *          "language": {
     *              "code": "vn",
     *              "name": "Vietnam"
     *          },
     *          "avatar": "https://ca.slack-edge.com/T018R4JFELS-U01B4GWNZ52-8d56e6c00be1-512",
     *          "shortIntro": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
     *          "deletedAt": null,
     *          "phoneNumber": "0123456789",
     *          "name": "Khanh Hoa",
     *          "email": "thagdet96@gmail.com",
     *          "status": 1,
     *          "username": "khanhhoa",
     *          "id": "FczXcOMojxRLA43VMKMMpXhu9ny2",
     *          "createdAt": {
     *              "_seconds": 1607766080,
     *              "_nanoseconds": 214000000
     *          },
     *          "updatedAt": {
     *              "_seconds": 1607767000,
     *              "_nanoseconds": 363000000
     *          }
     *      },
     *      "studyTitle": "IT",
     *      "studyPlace": "Sai Gon",
     *      "jobTitle": "Elite",
     *      "jobPlace": "Da Nang",
     *      "createdAt": {
     *          "_seconds": 1607767030,
     *          "_nanoseconds": 551000000
     *      },
     *      "updatedAt": {
     *          "_seconds": 1607767237,
     *          "_nanoseconds": 704005000
     *      },
     *      "deletedAt": null
     *  }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "Something went wrong"
     *   }
     *
     * @apiError UNAUTHORIZED Return Error Message.
     * @apiErrorExample {String} Error-Response:
     *   Error 401: Unauthorized
     *   Unauthorized
     */
    @httpPut('/:id', authorize({ roles: [UserRole.ADMIN, UserRole.STUDENT] }), validateUpdate)
    public async update(
        @requestParam('id') id: string,
        @requestBody() payload: UpdateStudentPayload,
        @response() res: Response
    ) {
        try {
            if (payload.shortIntro) {
                await this.userService.update(id, { shortIntro: payload.shortIntro });
            }

            const updated: Student = await this.studentService.update(id, payload);
            return res.status(HttpStatus.OK).json(updated.serialize());
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }
}
