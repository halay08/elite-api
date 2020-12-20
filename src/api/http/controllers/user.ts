import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut,
    interfaces,
    requestBody,
    requestParam,
    response
} from 'inversify-express-utils';
import { User } from '@/domain/index';
import { UserService, AuthService, StudentService, TutorService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { NewUserPayload, validateCreate, validateUpdate } from '@/api/http/requests/user';
import { UserRole, UserStatus } from '@/src/domain/types';
import { NotFoundError } from '@/src/app/errors';

@controller(`/users`)
export class UserController extends BaseHttpController implements interfaces.Controller {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.AuthService) private authService: AuthService,
        @inject(TYPES.StudentService) private studentService: StudentService,
        @inject(TYPES.TutorService) private tutorService: TutorService
    ) {
        super();
    }

    /**
     *
     * @api {GET} /users Get list of users
     * @apiGroup User
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization Access token
     * @apiHeaderExample {json} Header-Example:
     *   {
     *      "Authorization": "Bearer sdhjfksfdhjk23903482093483290"
     *   }
     *
     * @apiSuccess (200) {Array} List of users
     * @apiSuccessExample {Array} Success-Response:
     * [
     *      {
     *          "id": "Ygfec8d3BfVk7E7OeDPm",
     *          "name": "test123",
     *          "email": "test@gmail.com"
     *      }
     * ]
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
    @httpGet('/')
    public async all(@response() res: Response) {
        try {
            const data = await this.userService.getAll();

            return res.status(HttpStatus.OK).json(data.map((u) => u.serialize()));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    /**
     *
     * @api {GET} /users/:id Get user by id
     * @apiGroup User
     * @apiVersion  1.0.0
     *
     * @apiHeader {String} Authorization Access token
     * @apiHeaderExample {json} Header-Example:
     *   {
     *      "Authorization": "Bearer sdhjfksfdhjk23903482093483290"
     *   }
     *
     * @apiParam  {String} userId Id of user
     *
     * @apiSuccess (200) {Object} User data
     * @apiSuccessExample {Object} Success-Response:
     *      {
     *          "id": "Ygfec8d3BfVk7E7OeDPm",
     *          "name": "test123",
     *          "email": "test@gmail.com"
     *      }
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
    @httpGet('/:id', authorize({ roles: ['admin', 'student'] }))
    public async get(@requestParam('id') id: string, @response() res: Response) {
        try {
            const data = await this.userService.getById(id);
            if (!data) {
                throw new NotFoundError(`User/${id} not found`);
            }

            return res.status(HttpStatus.OK).json(data.serialize());
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    /**
     *
     * @api {POST} /users Create a new user
     * @apiGroup User
     * @apiVersion  1.0.0
     *
     * @apiParam  {String} uid uid of user
     * @apiParam  {String} email Email of user
     * @apiParam  {String} role Role of user
     *
     * @apiSuccess (200) {Object} Valid event
     * @apiSuccessExample {Object} Success-Response:
     *      {
     *          "created": true
     *      }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "Something went wrong"
     *   }
     */
    @httpPost('/', validateCreate)
    public async create(@requestBody() req: NewUserPayload, @response() res: Response) {
        try {
            const id = req.id;
            const existed = await this.userService.getById(id);
            if (existed) {
                return res.status(HttpStatus.OK).json(existed.serialize());
            }

            const role: UserRole | undefined = req.role ? (<any>UserRole)[req.role.toUpperCase()] : undefined;
            let user = User.create({
                id,
                email: req.email,
                status: UserStatus.ACTIVE
            });
            if (role) {
                user = { ...user, role } as User;
            }

            const data = await this.userService.create(user);
            await this.setRole(id, role);

            return res.status(HttpStatus.CREATED).json(data.serialize());
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    /**
     *
     * @api {PUT} /users/:id Update user
     * @apiGroup User
     * @apiVersion  1.0.0
     *
     * @apiParam  {String} id Id
     * @apiParam  {String} email Email of user
     * @apiParam  {String} name Name of user
     *
     * @apiSuccess (200) {Object} New data updated
     * @apiSuccessExample {Object} Success-Response:
     *      {
     *          "_id": "Ygfec8d3BfVk7E7OeDPm",
     *          "props": {
     *              "name": "test123",
     *              "email": "test@gmail.com"
     *          }
     *      }
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "Something went wrong"
     *   }
     */
    @httpPut('/:id', validateUpdate)
    public async update(@requestParam('id') id: string, @requestBody() payload: User, @response() res: Response) {
        try {
            if (payload.role) {
                const role: UserRole = (<any>UserRole)[payload.role.toUpperCase()];
                await this.setRole(id, role);
            }

            const data = await this.userService.updateFields(id, payload);
            return res.status(HttpStatus.OK).json(data.serialize());
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    /**
     *
     * @api {DELETE} /users/:id Delete an user
     * @apiGroup User
     * @apiVersion  1.0.0
     *
     * @apiParam  {String} id Id
     *
     * @apiSuccess (200) {Object} New data updated
     * @apiSuccessExample {String} Success-Response:
     * "w3HspOWwQ2BKYw6DKNQh"
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "Something went wrong"
     *   }
     */
    @httpDelete('/:id')
    public async delete(@requestParam('id') id: string, @response() res: Response) {
        try {
            const data = await this.userService.delete(id);

            return res.status(HttpStatus.OK).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    private async setRole(id: string, role?: UserRole): Promise<void> {
        if (!role) return;

        await this.authService.setCustomUserClaims(id, { role });

        switch (role) {
            case UserRole.STUDENT:
                await this.studentService.createByUserId(id);
                break;
            case UserRole.TUTOR:
                await this.tutorService.createByUserId(id);
                break;
            default:
                break;
        }
    }
}
