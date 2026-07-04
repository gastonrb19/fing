import { User } from "../models/UserEntity.js";
import { myDataSource } from "../config/app-data-source.js";
import { Pagination } from "../utils/pagination.js";
import { GeneralError, NotFoundError } from "../utils/classError.js";
import { createUserDTO } from "../dtos/user/createUserDTO.js";
import hashPassword from "../utils/hashPassword.js";

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

  async create(createUserDTO : createUserDTO): Promise<User> {
    // Check if already exist by unique values;
    const userByUsername = await myDataSource.getRepository(User).findOneBy({username: createUserDTO.username});
    if(userByUsername){
      throw new GeneralError(`User with username ${createUserDTO.username} already exist`, 400);
    }

    const userByEmail = await myDataSource.getRepository(User).findOneBy({email: createUserDTO.email});
    if(userByEmail){
      throw new GeneralError(`User with email ${createUserDTO.email} already exist`, 400);
    }

    const userByPhone = await myDataSource.getRepository(User).findOneBy({phone: createUserDTO.phone});
    if(userByPhone){
      throw new GeneralError(`User with phone ${createUserDTO.phone} already exist`, 400);
    }
    
    // Hash password
    const hashedPassword = await hashPassword(createUserDTO.hashedPassword);
    if(!hashedPassword){
      throw new GeneralError("Bad request, all fields for user are required. (password not provided)", 400);
    }

    const newUser = new User();
    Object.assign(newUser, {...createUserDTO, hashedPassword: hashedPassword })

    return await myDataSource.getRepository(User).save(newUser);
  }

  async update(id: number, updateUserDTO: Partial<createUserDTO>): Promise<User> {
    const user = await this.findOneById(id);
    if(!user){
      throw new NotFoundError("User", id);
    }
    Object.assign(user, updateUserDTO);
    return await myDataSource.getRepository(User).save(user);
  }
}
