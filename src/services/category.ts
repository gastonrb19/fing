import { Pagination } from "../utils/pagination.js";
import {CategoryEntity} from "../models/CategoryEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { GeneralError, NotFoundError } from "../utils/classError.js";
import { createCategoryDTO } from "../dtos/category/createCategoryDTO.js";
import { updateCategoryDTO } from "../dtos/category/updateCategoryDTO.js";

export class CategoryService {
    async findAll(pagination: Pagination): Promise<CategoryEntity[]> {
        return await myDataSource.getRepository(CategoryEntity).find({skip: pagination.offset, take: pagination.limit});
    }    

    async findOneById(id: number): Promise<CategoryEntity> { 
        const getCatgory = await myDataSource.getRepository(CategoryEntity).findOneBy({ id });
        if(!getCatgory){
            throw new NotFoundError('Category', id);
        }
        return getCatgory;
    }

    async create(createCategoryDTO: createCategoryDTO): Promise<CategoryEntity> {
        //Check if already exist by unique values;
        const categoryName = await myDataSource.getRepository(CategoryEntity).findOneBy({name: createCategoryDTO.name});
        if(categoryName){
            throw new GeneralError(`Category with name ${createCategoryDTO.name} already exist`, 400);
        }

        const newCategory = new CategoryEntity();
        Object.assign(newCategory, createCategoryDTO);
        return await myDataSource.getRepository(CategoryEntity).save(newCategory);
    }

    async update(id: number, updateCategoryDTO: updateCategoryDTO) : Promise<CategoryEntity> {
        const category = await this.findOneById(id);
        Object.assign(category, updateCategoryDTO);
        return await myDataSource.getRepository(CategoryEntity).save(category);
    }

    async delete(id: number): Promise<void> {
        const category = await this.findOneById(id);
        await myDataSource.getRepository(CategoryEntity).remove(category);
    }
}
