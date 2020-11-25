import { LIMIT } from '../config/pagination';

type IPagination = {
    page: number;

    limit: number;

    offset: number;
};

export class Paginator {
    constructor(private _page: number = 1) {
        this.page = _page;
    }

    set page(value: number) {
        let page = value;
        if (page <= 0) {
            page = 1;
        }
        this._page = page;
    }

    get(): IPagination {
        const page = this._page;
        const limit = LIMIT;

        const offset = (page - 1) * limit;

        return {
            page,
            limit,
            offset
        };
    }
}
