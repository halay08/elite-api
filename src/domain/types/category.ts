import { IEntity, ITimestamp } from '.';

type ICategory = {
    /**
     * Name  of category entity
     */
    name: string;

    slug: string;
};

type IEmbedCategory = ICategory & Required<IEntity>;

/**
 * Category entity
 */
type ICategoryEntity = IEntity & ICategory & ITimestamp;

export { ICategory, ICategoryEntity, IEmbedCategory };
