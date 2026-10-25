export function checkAndConvertPagination(pagination) {
    if (pagination.limit == undefined) {
        pagination.limit = "10";
    }
    if (pagination.offset == undefined) {
        pagination.offset = "0";
    }
    return { limit: Number(pagination.limit), offset: Number(pagination.offset) };
}
//# sourceMappingURL=checkPagination.js.map