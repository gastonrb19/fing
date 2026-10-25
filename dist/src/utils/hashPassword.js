import bcrypt from "bcrypt";
export default async function hashPassword(password) {
    if (password.length == 0) {
        return null;
    }
    return await bcrypt.hash(password, 10);
}
//# sourceMappingURL=hashPassword.js.map