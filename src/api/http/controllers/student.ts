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
import { StudentService, UserService, LearningDataService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { UpdateStudentPayload, validateUpdate } from '../requests/student';
import { UserRole } from '@/src/domain/types';

@controller(`/students`)
export class StudentController extends BaseHttpController implements interfaces.Controller {
    @inject(TYPES.StudentService) private studentService: StudentService;

    @inject(TYPES.UserService) private userService: UserService;

    @inject(TYPES.LearningDataService) private learningDataService: LearningDataService;

    @httpGet('/:id', authorize({ roles: [UserRole.ADMIN, UserRole.TUTOR, UserRole.STUDENT] }))
    public async get(@requestParam('id') id: string, @response() res: Response) {
        try {
            const student: Student = await this.studentService.getByUserId(id);

            // Get student learning data summary
            const summary = await this.learningDataService.getLearningDataSummary(student.id);

            const data = {
                info: student.serialize(),
                summary
            };

            return res.status(HttpStatus.OK).json(data);
        } catch ({ message }) {
            return res.status(HttpStatus.BAD_REQUEST).send({ message });
        }
    }

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
