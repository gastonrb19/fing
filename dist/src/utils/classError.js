export class GeneralError extends Error {
    statusCode;
    code;
    constructor(message, statusCode = 500, code = "SVR_ERR") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.code = code;
    }
}
export class NotFoundError extends GeneralError {
    constructor(resourceName, idValue) {
        // Traducción al español: Ej "Usuario con ID 4 no fue encontrado."
        const translatedResource = resourceName === 'User' ? 'Usuario'
            : resourceName === 'Spend' ? 'Gasto'
                : resourceName === 'Category' ? 'Categoría'
                    : resourceName === 'FriendRequest' ? 'Solicitud de amistad'
                        : resourceName;
        super(`El recurso (${translatedResource}) con identificador (${idValue}) no fue encontrado.`, 404, "NOT_FOUND");
    }
}
//# sourceMappingURL=classError.js.map