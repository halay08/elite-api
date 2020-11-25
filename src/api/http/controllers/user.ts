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
import { User } from '@/domain/index';
import { UserService, AuthService } from '@/src/app/services';
import TYPES from '@/src/types';
import { authorize } from '@/api/http/middlewares';
import { NewUserPayload } from '@/api/http/requests/user';
import { UserRole, UserStatus } from '@/src/domain/types';

const UserValidation = {
    create: {
        body: Joi.object({
            role: Joi.string().required(),
            email: Joi.string().email().required()
        })
    },
    update: {
        body: Joi.object({
            role: Joi.string(),
            email: Joi.string().email(),
            firstName: Joi.string(),
            lastName: Joi.string()
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

            return res.status(HttpStatus.CREATED).json(data.map((u) => u.serialize()));
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
            console.log('User information and Decoded Id Token: ', this.httpContext.user.details);

            return res.status(HttpStatus.CREATED).json(data.serialize());
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
    @httpPost('/', validate(UserValidation.create))
    public async create(@requestBody() req: NewUserPayload, @response() res: Response) {
        try {
            const role: UserRole = (<any>UserRole)[req.role.toUpperCase()];
            const user = User.create({
                role: role,
                email: req.email,
                status: UserStatus.ACTIVE
            });
            const data = await this.userService.create(user);
            await this.authService.setCustomUserClaims(req.uid, { role: req.role });

            return res.status(HttpStatus.CREATED).json(data);
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
    @httpPut('/:id', validate(UserValidation.update))
    public async update(@requestParam('id') id: string, @requestBody() payload: User, @response() res: Response) {
        try {
            let user: User = User.create(payload);

            if (payload.role) {
                const role: UserRole = (<any>UserRole)[payload.role.toUpperCase()];
                user = {
                    ...user,
                    role
                } as User;
            }

            const data = await this.userService.update(id, user);

            return res.status(HttpStatus.OK).json(data);
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
}
