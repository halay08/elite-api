import { IEntity, ITimstamp } from '.';

type ICategory = {
    /**
     * Name  of category entity
     */
    name: string;
};

/**
 * Category entity
 */
type ICategoryEntity = IEntity & ICategory & ITimstamp;

export { ICategory, ICategoryEntity };
