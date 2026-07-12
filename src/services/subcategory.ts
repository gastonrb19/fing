import { Pagination } from "../utils/pagination.js";
import { SubcategoryEntity } from "../models/SubcategoryEntity.js";
import { CategoryEntity } from "../models/CategoryEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { GeneralError, NotFoundError } from "../utils/classError.js";
import { createSubcategoryDTO } from "../dtos/subcategory/createSubcategoryDTO.js";
import { updateSubcategoryDTO } from "../dtos/subcategory/updateSubcategoryDTO.js";
import { CategoryService } from "./category.js";

export class SubcategoryService {
  private readonly categoryService: CategoryService;
  constructor(categoryService: CategoryService) {
    this.categoryService = categoryService;
  }
  async findAll(pagination: Pagination): Promise<SubcategoryEntity[]> {
    return await myDataSource.getRepository(SubcategoryEntity).find({
      skip: pagination.offset,
      take: pagination.limit,
      relations: { category: true },
    });
  }

  async findByCategory(
    categoryId: number,
    pagination: Pagination,
  ): Promise<SubcategoryEntity[]> {
    //Validate that the parent category exists;
    const category = await this.categoryService.findOneById(categoryId);
    
    return await myDataSource.getRepository(SubcategoryEntity).find({
      where: { category: { id: categoryId } },
      skip: pagination.offset,
      take: pagination.limit,
      relations: { category: true },
    });
  }

  async findOneById(id: number): Promise<SubcategoryEntity> {
    const getSubcategory = await myDataSource
      .getRepository(SubcategoryEntity)
      .findOne({
        where: { id },
        relations: { category: true },
      });
    if (!getSubcategory) {
      throw new NotFoundError("Subcategory", id);
    }
    return getSubcategory;
  }

  async create(
    createSubcategoryDTO: createSubcategoryDTO,
  ): Promise<SubcategoryEntity> {
    //Check if already exist by unique values;
    const subcategoryName = await myDataSource
      .getRepository(SubcategoryEntity)
      .findOneBy({ name: createSubcategoryDTO.name });
    if (subcategoryName) {
      throw new GeneralError(
        `Subcategory with name ${createSubcategoryDTO.name} already exist`,
        400,
      );
    }

    //Check that the parent category exists;
    const category = await myDataSource
      .getRepository(CategoryEntity)
      .findOneBy({ id: createSubcategoryDTO.categoryId });
    if (!category) {
      throw new NotFoundError("Category", createSubcategoryDTO.categoryId);
    }

    const newSubcategory = new SubcategoryEntity();
    newSubcategory.name = createSubcategoryDTO.name;
    newSubcategory.description = createSubcategoryDTO.description as string;
    newSubcategory.category = category;
    return await myDataSource
      .getRepository(SubcategoryEntity)
      .save(newSubcategory);
  }

  async update(
    id: number,
    updateSubcategoryDTO: updateSubcategoryDTO,
  ): Promise<SubcategoryEntity> {
    const subcategory = await this.findOneById(id);

    //If the name changes, validate uniqueness;
    if (
      updateSubcategoryDTO.name &&
      updateSubcategoryDTO.name !== subcategory.name
    ) {
      const subcategoryName = await myDataSource
        .getRepository(SubcategoryEntity)
        .findOneBy({ name: updateSubcategoryDTO.name });
      if (subcategoryName) {
        throw new GeneralError(
          `Subcategory with name ${updateSubcategoryDTO.name} already exist`,
          400,
        );
      }
    }

    //If the category changes, validate that the new one exists;
    if (updateSubcategoryDTO.categoryId) {
      const category = await myDataSource
        .getRepository(CategoryEntity)
        .findOneBy({ id: updateSubcategoryDTO.categoryId });
      if (!category) {
        throw new NotFoundError("Category", updateSubcategoryDTO.categoryId);
      }
      subcategory.category = category;
    }

    if (updateSubcategoryDTO.name !== undefined) {
      subcategory.name = updateSubcategoryDTO.name;
    }
    if (updateSubcategoryDTO.description !== undefined) {
      subcategory.description = updateSubcategoryDTO.description as string;
    }

    return await myDataSource
      .getRepository(SubcategoryEntity)
      .save(subcategory);
  }

  async delete(id: number): Promise<void> {
    const subcategory = await this.findOneById(id);
    await myDataSource.getRepository(SubcategoryEntity).remove(subcategory);
  }
}
