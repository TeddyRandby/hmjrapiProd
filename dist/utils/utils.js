"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBooks = exports.dateGreaterThanOrEqualTo = exports.dateLessThanOrEqualTo = exports.findGreatestDate = exports.findLeastDate = void 0;
function findLeastDate(dates) {
    if (dates.length < 1)
        return null;
    return dates.reduce((acc, curr) => dateLessThanOrEqualTo(acc, curr) ? acc : curr);
}
exports.findLeastDate = findLeastDate;
function findGreatestDate(dates) {
    if (dates.length < 1)
        return null;
    return dates.reduce((acc, curr) => dateGreaterThanOrEqualTo(acc, curr) ? acc : curr);
}
exports.findGreatestDate = findGreatestDate;
function dateLessThanOrEqualTo(a, b) {
    if (a.year < b.year) {
        return true;
    }
    else if (a.year == b.year && a.month < b.month) {
        return true;
    }
    else if (a.month == b.month && a.day <= b.day) {
        return true;
    }
    else {
        return false;
    }
}
exports.dateLessThanOrEqualTo = dateLessThanOrEqualTo;
function dateGreaterThanOrEqualTo(a, b) {
    if (a.year > b.year) {
        return true;
    }
    else if (a.year == b.year && a.month > b.month) {
        return true;
    }
    else if (a.month == b.month && a.day >= b.day) {
        return true;
    }
    else {
        return false;
    }
}
exports.dateGreaterThanOrEqualTo = dateGreaterThanOrEqualTo;
let CleanBooks = [];
for (let i = 689; i < 749; i++) {
    CleanBooks.push(`${i}`);
}
function findBooks(clean, books) {
    if (clean) {
        if (books.length > 0) {
            books = books.filter((book) => CleanBooks.includes(book));
            return books.length ? books : null;
        }
        else {
            return CleanBooks;
        }
    }
    else {
        return books;
    }
}
exports.findBooks = findBooks;
//# sourceMappingURL=utils.js.map