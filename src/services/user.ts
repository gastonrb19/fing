import { User } from "../models/UserEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { Pagination } from "../utils/pagination.js";
import { NotFoundError } from "../utils/classError.js";

export class UserService {
  async findAll(pagination: Pagination): Promise<User[]> {
    //check length and throw new error in case that already wasn't find record
    return await myDataSource
      .getRepository(User)
      .find({ skip: pagination.offset, take: pagination.limit });
  }

  async findOneById(id: number): Promise<User> {
    const getUser = await myDataSource.getRepository(User).findOneBy({id: id});
    if(!getUser){
        throw new NotFoundError("User", id);
    }
    return getUser;
  }
}
