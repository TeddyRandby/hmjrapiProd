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
exports.Date = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let Date = class Date extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Date.prototype, "day", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Date.prototype, "month", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Date.prototype, "year", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], Date.prototype, "stringified", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Date.prototype, "content", void 0);
Date = __decorate([
    typeorm_1.Entity(),
    type_graphql_1.ObjectType(),
    type_graphql_1.InputType("DateInput")
], Date);
exports.Date = Date;
//# sourceMappingURL=Date.js.map