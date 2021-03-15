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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entry = void 0;
const typeorm_1 = require("typeorm");
const Date_1 = require("../models/Date");
const Index_1 = require("../models/Index");
const type_graphql_1 = require("type-graphql");
let Entry = class Entry extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.ObjectIdColumn(),
    __metadata("design:type", typeorm_1.ObjectID)
], Entry.prototype, "_id", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Entry.prototype, "boxID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Entry.prototype, "book", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Entry.prototype, "header", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column({ default: "" }),
    __metadata("design:type", String)
], Entry.prototype, "content", void 0);
__decorate([
    type_graphql_1.Field(() => [Date_1.Date], { nullable: true }),
    typeorm_1.Column({ default: [] }),
    __metadata("design:type", Array)
], Entry.prototype, "dates", void 0);
__decorate([
    type_graphql_1.Field(() => [Index_1.Index], { nullable: true }),
    typeorm_1.Column({ default: [] }),
    __metadata("design:type", Array)
], Entry.prototype, "indexes", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    typeorm_1.Column({ default: [] }),
    __metadata("design:type", Array)
], Entry.prototype, "people", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    typeorm_1.Column({ default: [] }),
    __metadata("design:type", Array)
], Entry.prototype, "locations", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    typeorm_1.Column({ default: [] }),
    __metadata("design:type", Array)
], Entry.prototype, "organizations", void 0);
__decorate([
    type_graphql_1.Field(() => Date_1.Date, { nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date_1.Date)
], Entry.prototype, "minDate", void 0);
__decorate([
    type_graphql_1.Field(() => Date_1.Date, { nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", Date_1.Date)
], Entry.prototype, "maxDate", void 0);
Entry = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType(),
    type_graphql_1.InputType("EntryInput")
], Entry);
exports.Entry = Entry;
//# sourceMappingURL=Entry.js.map