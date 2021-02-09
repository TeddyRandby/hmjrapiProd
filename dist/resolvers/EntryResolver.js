"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntryResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Entry_1 = require("../models/Entry");
const Date_1 = require("../models/Date");
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils/utils");
let EntryResolver = class EntryResolver {
    entries(max, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(Entry_1.Entry).find({ take: max, skip: offset });
        });
    }
    entriesByBoxID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                where: {
                    boxID: { $eq: id }
                }
            });
            return entries.map(entry => (Object.assign(Object.assign({}, entry), { indexes: entry.indexes.map(index => (Object.assign(Object.assign({}, index), { book: entry.book, stringified: index.page.toString() }))) })));
        });
    }
    entriesByKeyword(data, max) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                take: max,
                where: {
                    $or: [
                        { header: { $regex: new RegExp(data) } },
                        { content: { $regex: new RegExp(data) } },
                    ],
                },
            });
        });
    }
    entriesByDate(date, max) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                take: max,
                where: {
                    $and: [
                        {
                            $and: [
                                { "minDate.day": { $lte: date.day } },
                                { "minDate.month": { $lte: date.month } },
                                { "minDate.year": { $lte: date.year } },
                            ],
                        },
                        {
                            $and: [
                                { "maxDate.day": { $gte: date.day } },
                                { "maxDate.month": { $gte: date.month } },
                                { "maxDate.year": { $gte: date.year } },
                            ],
                        },
                    ],
                },
            });
        });
    }
    entriesByBook(book, max) {
        return __awaiter(this, void 0, void 0, function* () {
            let entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                take: max,
                where: {
                    book: book
                }
            });
            return entries.map(entry => (Object.assign(Object.assign({}, entry), { indexes: entry.indexes.map(index => (Object.assign(Object.assign({}, index), { page: index.page.toString(), stringified: index.page.toString() }))) })));
        });
    }
    createEntry() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(Entry_1.Entry).create().save();
        });
    }
    deleteEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getMongoRepository(Entry_1.Entry).findOneAndDelete({
                where: {
                    "_id": id
                }
            });
            return result.ok;
        });
    }
    updateEntry(id, entry) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = yield typeorm_1.getMongoRepository(Entry_1.Entry).findOne(id);
            if (!original)
                return original;
            if (entry.header)
                original.header = entry.header;
            if (entry.content)
                original.content = entry.content;
            if (entry.book)
                original.book = entry.book;
            if (entry.dates) {
                original.dates = entry.dates;
                let least = utils_1.findLeastDate(entry.dates);
                if (least)
                    original.minDate = least;
                let greatest = utils_1.findGreatestDate(entry.dates);
                if (greatest)
                    original.maxDate = greatest;
            }
            if (entry.indexes)
                original.indexes = entry.indexes;
            yield original.save();
            return original;
        });
    }
    updatePage(id, entry) {
        return __awaiter(this, void 0, void 0, function* () {
            let original = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                where: {
                    boxID: id
                }
            });
            console.log(entry);
            return original;
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("max")), __param(1, type_graphql_1.Arg("offset")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entries", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByBoxID", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("keyword")),
    __param(1, type_graphql_1.Arg("max")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByKeyword", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("date")), __param(1, type_graphql_1.Arg("max")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date_1.Date, Number]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByDate", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("book")), __param(1, type_graphql_1.Arg("max")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByBook", null);
__decorate([
    type_graphql_1.Mutation(() => Entry_1.Entry),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "createEntry", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "deleteEntry", null);
__decorate([
    type_graphql_1.Mutation(() => Entry_1.Entry),
    __param(0, type_graphql_1.Arg("id")), __param(1, type_graphql_1.Arg("entry")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Entry_1.Entry]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "updateEntry", null);
__decorate([
    type_graphql_1.Mutation(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("id")), __param(1, type_graphql_1.Arg("entry")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Entry_1.Entry]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "updatePage", null);
EntryResolver = __decorate([
    type_graphql_1.Resolver()
], EntryResolver);
exports.EntryResolver = EntryResolver;
//# sourceMappingURL=EntryResolver.js.map