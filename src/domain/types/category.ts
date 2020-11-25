import { IEntity, ITimestamp } from '.';

type ICategory = {
    /**
     * Name  of category entity
     */
    name: string;
};

/**
 * Category entity
 */
type ICategoryEntity = IEntity & ICategory & ITimestamp;

export { ICategory, ICategoryEntity };
