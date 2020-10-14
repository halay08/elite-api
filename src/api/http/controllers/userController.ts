import { Response } from 'express';
import { Joi, validate } from 'express-validation';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import {
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
import {
    ApiOperationGet,
    ApiOperationPost,
    ApiPath,
    SwaggerDefinitionConstant
} from 'swagger-express-ts';

import { User } from '@/domain/user';
import { UserService } from '@/src/app/services';
import TYPES from '@/src/types';

const UserValidation = {
    create: {
        body: Joi.object({
            id: Joi.number(),
            name: Joi.string().min(6).required(),
            email: Joi.string().email().required()
        })
    }
};

@ApiPath({
    path: '/todo-0711/us-central1/api/v1/users',
    name: 'Version',
    security: { basicAuth: [] }
})
@controller(`/users`)
export class UserController implements interfaces.Controller {
    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @ApiOperationGet({
        description: 'Get users list',
        summary: 'Get users list',
        responses: {
            200: {
                description: 'Success',
                type: SwaggerDefinitionConstant.Response.Type.ARRAY,
                model: 'User'
            }
        },
        security: {
            apiKeyHeader: []
        }
    })
    @httpGet('/')
    public async getUsers(@response() res: Response): Promise<User[] | void> {
        try {
            const data = await this.userService.getUsers();

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    @httpGet('/:id')
    public async getUser(
        @requestParam('id') id: string,
        @response() res: Response
    ): Promise<User | void> {
        try {
            const data = await this.userService.getUser(id);

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    @ApiOperationPost({
        description: 'Create a new user',
        summary: 'Signup',
        security: {
            // bearerHeader: []
        },
        parameters: {
            body: { description: 'New version', required: true, model: 'User' }
        },
        responses: {
            200: { description: 'Success' },
            400: { description: 'Parameters fail' }
        }
    })
    @httpPost('/', validate(UserValidation.create))
    public async newUser(@requestBody() user: User, @response() res: Response): Promise<void> {
        try {
            const data: string = await this.userService.newUser(user);

            res.status(HttpStatus.CREATED).json(data);
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

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

    @httpDelete('/:id')
    public async deleteUser(
        @requestParam('id') id: string,
        @response() res: Response
    ): Promise<string | void> {
        try {
            const data = await this.userService.deleteUser(id);

            return data;
        } catch (error) {
            res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }
}
