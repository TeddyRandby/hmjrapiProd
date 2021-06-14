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
const Promises_1 = require("../utils/Promises");
let EntryResolver = class EntryResolver {
    entries(max, keywords, dates, books) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let entries;
            if (dates.length > 0) {
                const minDate = (_a = utils_1.findLeastDate(dates)) !== null && _a !== void 0 ? _a : { day: 100, month: 100, year: 100 };
                const maxDate = (_b = utils_1.findGreatestDate(dates)) !== null && _b !== void 0 ? _b : { day: 0, month: 0, year: 0 };
                entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                    take: max,
                    where: {
                        $and: [
                            {
                                book: { $regex: new RegExp(books.join('|') || /./g) }
                            },
                            {
                                $or: [
                                    { header: { $regex: new RegExp(keywords.join('|') || /./g) } },
                                    { content: { $regex: new RegExp(keywords.join('|') || /./g) } },
                                ]
                            },
                            {
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
                            },
                        ]
                    }
                });
            }
            else {
                entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                    take: max,
                    where: {
                        $and: [
                            {
                                book: { $regex: new RegExp(books.join('|') || /./g) }
                            },
                            {
                                $or: [
                                    { header: { $regex: new RegExp(keywords.join('|') || /./g) } },
                                    { content: { $regex: new RegExp(keywords.join('|') || /./g) } },
                                ]
                            },
                        ]
                    }
                });
            }
            return entries.map(entry => (Object.assign(Object.assign({}, entry), { indexes: entry.indexes
                    .map(index => (Object.assign(Object.assign({}, index), { book: entry.book, page: isNaN(index.page) ? 1 : index.page }))) })));
        });
    }
    volume(vol) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promises_1.getVolumeDownloadURL(vol);
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
    entriesByKeyword(keywords, max) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                take: max,
                where: {
                    $or: [
                        { header: { $regex: new RegExp(keywords.join('|')) } },
                        { content: { $regex: new RegExp(keywords.join('|')) } },
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
    entriesByBook(books, max) {
        return __awaiter(this, void 0, void 0, function* () {
            let entries = yield typeorm_1.getMongoRepository(Entry_1.Entry).find({
                take: max,
                where: {
                    book: { $regex: new RegExp(books.join('|')) }
                }
            });
            return entries.map(entry => (Object.assign(Object.assign({}, entry), { indexes: entry.indexes
                    .map(index => (Object.assign(Object.assign({}, index), { page: isNaN(index.page) ? 1 : index.page }))) })));
        });
    }
    createEntry(book) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getMongoRepository(Entry_1.Entry).create({ book, header: "", content: "", dates: [], indexes: [] }).save();
        });
    }
    deleteEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield typeorm_1.getMongoRepository(Entry_1.Entry).delete(id);
            return result.affected || 0;
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
            if (entry.people)
                original.people = entry.people;
            if (entry.locations)
                original.locations = entry.locations;
            if (entry.organizations)
                original.organizations = entry.organizations;
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
    __param(0, type_graphql_1.Arg("max")), __param(1, type_graphql_1.Arg("keywords", () => [String])), __param(2, type_graphql_1.Arg("dates", () => [Date_1.Date])), __param(3, type_graphql_1.Arg("books", () => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array, Array, Array]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entries", null);
__decorate([
    type_graphql_1.Query(() => String),
    __param(0, type_graphql_1.Arg("volume")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "volume", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByBoxID", null);
__decorate([
    type_graphql_1.Query(() => [Entry_1.Entry]),
    __param(0, type_graphql_1.Arg("keyword", () => [String])),
    __param(1, type_graphql_1.Arg("max")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
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
    __param(0, type_graphql_1.Arg("book", () => [String])), __param(1, type_graphql_1.Arg("max")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Number]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "entriesByBook", null);
__decorate([
    type_graphql_1.Mutation(() => Entry_1.Entry),
    __param(0, type_graphql_1.Arg("book")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EntryResolver.prototype, "createEntry", null);
__decorate([
    type_graphql_1.Mutation(() => Number),
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