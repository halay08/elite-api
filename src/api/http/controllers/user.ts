import { Response } from 'express';
import { Joi, validate } from 'express-validation';
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
import { User, UserEntity } from '@/domain/user';
import { UserService, AuthService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { USER_ROLES } from '@/api/http/config/constants';
import { NewUserPayload } from '@/api/http/requests/user';

const UserValidation = {
    create: {
        body: Joi.object({
            role: Joi.string()
                .required()
                .valid(...USER_ROLES),
            email: Joi.string().email().required(),
            uid: Joi.string().required(),
            createdAt: Joi.string()
        })
    }
};

@controller(`/users`)
export class UserController extends BaseHttpController implements interfaces.Controller {
    constructor(
        @inject(TYPES.UserService) private userService: UserService,
        @inject(TYPES.AuthService) private authService: AuthService
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
     *          "_id": "Ygfec8d3BfVk7E7OeDPm",
     *          "props": {
     *              "name": "test123",
     *              "email": "test@gmail.com"
     *          }
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
    public async getUsers(@response() res: Response): Promise<User[] | void> {
        try {
            const data = await this.userService.getUsers();

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
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
     *
     * @apiError UNAUTHORIZED Return Error Message.
     * @apiErrorExample {String} Error-Response:
     *   Error 401: Unauthorized
     *   Unauthorized
     */
    @httpGet('/:id', authorize({ roles: ['admin', 'student'] }))
    public async getUser(@requestParam('id') id: string, @response() res: Response): Promise<User | void> {
        try {
            const data = await this.userService.getUser(id);
            console.log('User information and Decoded Id Token: ', this.httpContext.user.details);

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
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
     * @apiParam  {String} createdAt Created time of user
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
    @httpPost('/', validate(UserValidation.create))
    public async create(@requestBody() req: NewUserPayload, @response() res: Response): Promise<void> {
        try {
            const entity: UserEntity = { role: req.role, email: req.email, createdAt: req.createdAt };
            const user = new User(entity, req.uid);
            const data = await this.userService.create(user);
            await this.authService.setCustomUserClaims(req.uid, { role: req.role });
            res.status(HttpStatus.CREATED).json({ data });
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
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
    @httpPut('/:id', validate(UserValidation.create))
    public async updateUser(
        @requestParam('id') id: string,
        @requestBody() user: User,
        @response() res: Response
    ): Promise<string | void> {
        try {
            const data = await this.userService.updateUser(id, user);

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
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
    public async deleteUser(@requestParam('id') id: string, @response() res: Response): Promise<string | void> {
        try {
            const data = await this.userService.deleteUser(id);

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}
