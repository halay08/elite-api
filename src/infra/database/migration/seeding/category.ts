import { inject } from 'inversify';
import TYPES from '@/src/types';
import { ICategoryRepository } from '@/src/infra/database/repositories';
import { provide } from 'inversify-binding-decorators';
import { ISeeding } from '.';
import { Category } from '@/domain';

@provide(TYPES.CategorySeeding)
export class CategorySeeding implements ISeeding {
    constructor(
        @inject(TYPES.CategoryRepository)
        private readonly _categoryRepository: ICategoryRepository
    ) {}

    async run() {
        const categories = [
            {
                name: 'English',
                slug: 'english'
            }
        ];

        for (const category of categories) {
            const existedCategory = await this._categoryRepository.findBy('name', category.name);
            if (existedCategory.length > 0) {
                console.log(`Category <${category.name}> already existed in the database`);
                continue;
            }

            const categoryModel: Category = Category.create(category);
            const newCategory = await this._categoryRepository.create(categoryModel);
            const newCategoryEntity = newCategory.serialize();
            console.log(`New category was created ${newCategoryEntity.id}`);
        }

        console.log('DONE!');
    }
}
