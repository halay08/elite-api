import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces, response, queryParam } from 'inversify-express-utils';
import { TutorService } from '@/src/app/services';
import TYPES from '@/src/types';
import { ITutorQuery, TutorFilterStatus } from '../requests';
import { IFirestoreQuery } from '@/src/infra/database/firestore/types';
import { Tutor } from '@/src/domain';
import { TutorStatus, ITutorEntity } from '@/domain/types';
import { IQueryOption } from '@/infra/database/types';
import { Paginator } from '../helpers/paginator';

@controller(`/tutors`)
export class TutorController extends BaseHttpController implements interfaces.Controller {
    constructor(@inject(TYPES.TutorService) private tutorService: TutorService) {
        super();
    }

    /**
     *
     * @api {GET} /tutors Get list of tutors. No authentication required
     * @apiGroup Tutor
     * @apiVersion  1.0.0
     *
     * @apiSuccess (200) {Array} List of tutors
     * @apiSuccessExample {Array} Success-Response:
     * [
     *      {
     *          "_id": "Ygfec8d3BfVk7E7OeDPm",
     *          "user": {
     *              "id": "yZGFDF6fGC3DdfgLgh69",
     *              "email": "test@example.com"
     *          },
     *          "category": {
     *              "id": "z6N89Oisw3ojJHGF23FS",
     *              "name": "English"
     *          },
     *          "status": "online"
     *      }
     * ]
     *
     * @apiError BAD_REQUEST Return Error Message.
     * @apiErrorExample {Object} Error-Response:
     *   Error 400: Bad Request
     *   {
     *     "error": "something went wrong"
     *   }
     */
    @httpGet('/')
    public async index(@queryParam() queries: ITutorQuery, @response() res: Response) {
        try {
            const queryOption: Partial<IQueryOption<Tutor>> = {};
            // startTime will be implemented when we have course and session data.
            const { page = 1, category, expertise, startTime, status } = queries;

            const pagination = new Paginator(page).get();
            queryOption.limit = pagination.limit;
            queryOption.startAt = pagination.offset;

            const operatorQueries = this._getOperatorQueries(queries);
            const items = await this.tutorService.query(operatorQueries, queryOption);
            const data = {
                pagination: {
                    currentPage: page,
                    nextPage: page + 1,
                    totalItemOfPage: items.length
                },
                filter: {
                    category,
                    expertise,
                    startTime,
                    status
                },
                sort: queries.sort,
                items: items.map((t) => t.serialize())
            };

            return res.status(HttpStatus.OK).json(data);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    }

    /**
     * Get operator queries for tutor list
     * @param queries
     */
    private _getOperatorQueries(queries: ITutorQuery): IFirestoreQuery<Tutor>[] {
        const operatorQueries: IFirestoreQuery<Tutor>[] = [];

        const { category, expertise, status } = queries;

        if (status === TutorFilterStatus.ONLINE) {
            operatorQueries.push({ activeStatus: TutorStatus.ACTIVE });
        }

        if (category) {
            const key = 'category.slug' as keyof ITutorEntity;
            operatorQueries.push({ [key]: queries.category });
        }

        if (expertise) {
            operatorQueries.push({
                expertises: queries.expertise,
                operator: 'array-contains'
            });
        }

        return operatorQueries;
    }
}
