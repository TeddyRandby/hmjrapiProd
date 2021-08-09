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
const typeorm_1 = require("typeorm");
const Date_1 = require("../models/Date");
const Entry_1 = require("../models/Entry");
const Promises_1 = require("../utils/Promises");
const utils_1 = require("../utils/utils");
let EntryResolver = class EntryResolver {
    entries(max, clean, keywords, dates, tags, books) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let entries;
            let newBooks = utils_1.findBooks(clean, books);
            if (!newBooks) {
                return [];
            }
            books = newBooks;
            let query = {
                take: 0,
                where: {
                    $and: [],
                }
            };
            query.take = max;
            query.where.$and = [];
            if (books.length > 0) {
                query.where.$and.push({ book: { $in: books } });
            }
            if (tags.length > 0) {
                query.where.$and.push({ tags: { $elemMatch: { $in: tags } } });
            }
            if (dates.length > 0) {
                const minDate = (_a = utils_1.findLeastDate(dates)) !== null && _a !== void 0 ? _a : {
                    day: 100, month: 100, year: 100
                };
                const maxDate = (_b = utils_1.findGreatestDate(dates)) !== null && _b !== void 0 ? _b : { day: 0, month: 0, year: 0 };
                query.where.$and.push({
                    $or: [
                        {
                            $and: [
                                { "minDate.day": { $lte: maxDate.day } },
                                { "minDate.month": { $lte: maxDate.month } },
                                { "minDate.year": { $lte: maxDate.year } },
                                { "minDate.day": { $gte: minDate.day } },
                                { "minDate.month": { $gte: minDate.month } },
                                { "minDate.year": { $gte: minDate.year } },
                            ],
                        },
                        {
                            $and: [
                                { "maxDate.day": { $lte: minDate.day } },
                                { "maxDate.month": { $lte: minDate.month } },
                                { "maxDate.year": { $lte: minDate.year } },
                                { "maxDate.day": { $gte: maxDate.day } },
                                { "maxDate.month": { $gte: maxDate.month } },
                                { "maxDate.year": { $gte: maxDate.year } },
                            ],
                        },
                    ],
                });
            }
            if (keywords.length > 0) {
                query.where.$and.push({
                    $or: [
                        {
                            header: { $regex: new RegExp(keywords.join('|') || /./g) }
                        },
                        {
                            content: { $regex: new RegExp(keywords.join('|') || /./g) }
                        },
                    ]
                });
            }
            entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find(query);
            return entries.map(entry => (Object.assign(Object.assign({}, entry), { indexes: entry.indexes.map(index => (Object.assign(Object.assign({}, index), { book: index.book ? index.book : entry.book, page: index.page ? index.page : "NaN" }))) })));
        });
    }
    entriesByBook(books, max) {
        return __awaiter(this, void 0, void 0, function* () {
            let entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({ take: max, where: { book: { $regex: new RegExp(books.join('|')) } } });
            return entries.map(entry => (Object.assign(Object.assign({}, entry), { indexes: entry.indexes.map(index => (Object.assign(Object.assign({}, index), { book: index.book ? index.book : entry.book, page: index.page ? index.page : "NaN" }))) })));
        });
    }
    volume(vol) {
        return __awaiter(this, void 0, void 0, function* () { return yield Promises_1.getVolumeDownloadURL(vol); });
    }
    createEntry(author, book) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.validateAuthor(author))
                return null;
            return yield typeorm_1.getMongoRepository(Entry_1.Entry)
                .create({
                book,
                header: "",
                content: "",
                dates: [],
                indexes: [],
                mostRecentAuthor: author
            })
                .save();
        });
    }
    deleteEntry(id, author) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.validateAuthor(author))
                return 0;
            const result = yield typeorm_1.getMongoRepository(Entry_1.Entry).delete(id);
            return result.affected || 0;
        });
    }
    updateEntry(id, author, entry) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!utils_1.validateAuthor(author))
                return "Invalid Author";
            let original = yield typeorm_1.getMongoRepository(Entry_1.Entry).findOne(id);
            if (!original)
                return "Invalid id";
            original.mostRecentAuthor = author;
            if (entry.dates) {
                original.dates = entry.dates;
                original.minDate = utils_1.findLeastDate(entry.dates) || original.minDate;
                original.maxDate = utils_1.findGreatestDate(entry.dates) || original.maxDate;
            }
            original.header = entry.header || original.header;
            original.content = entry.content || original.content;
            original.book = entry.book || original.book;
            original.indexes = entry.indexes || original.indexes;
            original.people = entry.people || original.people;
            original.locations = entry.locations || original.locations;
            original.organizations = entry.organizations || original.organizations;
            original.tags = entry.tags || original.tags;
            if (yield original.save())
                return "Updated entry";
            else
                return "Could not save entry";
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("max", { defaultValue: 50 })),
    __param(1, type_graphql_1.Arg("clean", { defaultValue: false })),
    __param(2, type_graphql_1.Arg("keywords", _ => [String], { defaultValue: [] })),
    __param(3, type_graphql_1.Arg("dates", _ => [Date_1.Date], { defaultValue: [] })),
    __param(4, type_graphql_1.Arg("tags", _ => [String], { defaultValue: [] })),
    __param(5, type_graphql_1.Arg("books", _ => [String], { defaultValue: [] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean, Array, Array, Array, Array]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entries", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("book", () => [String])), __param(1, type_graphql_1.Arg("max")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByBook", null);
__decorate([
    type_graphql_1.Query(() => String),
    __param(0, type_graphql_1.Arg("volume")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "volume", null);
__decorate([
    type_graphql_1.Mutation(() => Entry_1.Entry),
    __param(0, type_graphql_1.Arg("author")),
    __param(1, type_graphql_1.Arg("book")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "createEntry", null);
__decorate([
    type_graphql_1.Mutation(() => Number),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("author")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "deleteEntry", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Arg("author")),
    __param(2, type_graphql_1.Arg("entry")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Entry_1.Entry]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "updateEntry", null);
EntryResolver = __decorate([
    type_graphql_1.Resolver()
], EntryResolver);
exports.EntryResolver = EntryResolver;
//# sourceMappingURL=EntryResolver.js.map