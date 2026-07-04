import bcrypt from "bcrypt";

export default async function hashPassword(password: string) : Promise<string | null>{
    if(password.length == 0){
        return null;
    }
    return await bcrypt.hash(password, 10);
}