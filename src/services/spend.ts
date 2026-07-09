import { Pagination } from "../utils/pagination.js";
import { SpendEntity } from "../models/SpendEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { NotFoundError } from "../utils/classError.js";
import { createSpendDTO } from "../dtos/spend/createSpendDTO.js";
import { updateSpendDTO } from "../dtos/spend/updateSpendDTO.js";
import { UserService } from "./user.js";
import { SubcategoryService } from "./subcategory.js";

export class SpendService {
    private readonly userService: UserService;
    private readonly subcategoryService: SubcategoryService;

    constructor(userService: UserService, subcategoryService: SubcategoryService) {
        this.userService = userService;
        this.subcategoryService = subcategoryService;
    }

    async findAll(pagination: Pagination): Promise<SpendEntity[]> {
        return await myDataSource.getRepository(SpendEntity).find({
            skip: pagination.offset,
            take: pagination.limit,
            relations: { user: true, subcategory: true },
        });
    }

    async findOneById(id: number): Promise<SpendEntity> {
        const getSpend = await myDataSource.getRepository(SpendEntity).findOne({
            where: { id },
            relations: { user: true, subcategory: true },
        });
        if(!getSpend){
            throw new NotFoundError('Spend', id);
        }
        return getSpend;
    }

    // GET /users/:id_user/spends?subcategory=<id_subcategory>
    async findByUserAndSubcategory(userId: number, subcategoryId: number, pagination: Pagination): Promise<SpendEntity[]> {
        //Validate that the subcategory (query value) exists; findOneById throws if it doesn't;
        await this.subcategoryService.findOneById(subcategoryId);

        //Where by the user (path) and the subcategory FK (query);
        return await myDataSource.getRepository(SpendEntity).find({
            where: {
                user: { id: userId },
                subcategory: { id: subcategoryId },
            },
            skip: pagination.offset,
            take: pagination.limit,
            relations: { user: true, subcategory: true },
        });
    }

    async create(createSpendDTO: createSpendDTO): Promise<SpendEntity> {
        //findOneById already throws NotFoundError if the resource doesn't exist;
        const user = await this.userService.findOneById(createSpendDTO.userId);
        const subcategory = await this.subcategoryService.findOneById(createSpendDTO.subcategoryId);

        const newSpend = new SpendEntity();
        newSpend.name = createSpendDTO.name;
        newSpend.amount = createSpendDTO.amount;
        newSpend.user = user;
        newSpend.subcategory = subcategory;
        return await myDataSource.getRepository(SpendEntity).save(newSpend);
    }

    async update(id: number, updateSpendDTO: updateSpendDTO): Promise<SpendEntity> {
        // findOneById already throws NotFoundError if it doesn't exist;
        const spend = await this.findOneById(id);

        //If the user changes, findOneById throws if the new one doesn't exist;
        if(updateSpendDTO.userId){
            spend.user = await this.userService.findOneById(updateSpendDTO.userId);
        }

        //If the subcategory changes, findOneById throws if the new one doesn't exist;
        if(updateSpendDTO.subcategoryId){
            spend.subcategory = await this.subcategoryService.findOneById(updateSpendDTO.subcategoryId);
        }

        if(updateSpendDTO.name !== undefined){
            spend.name = updateSpendDTO.name;
        }
        if(updateSpendDTO.amount !== undefined){
            spend.amount = updateSpendDTO.amount;
        }

        return await myDataSource.getRepository(SpendEntity).save(spend);
    }

    async delete(id: number): Promise<void> {
        // findOneById already throws NotFoundError if it doesn't exist;
        const spend = await this.findOneById(id);
        await myDataSource.getRepository(SpendEntity).remove(spend);
    }
}
