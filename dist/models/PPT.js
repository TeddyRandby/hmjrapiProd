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
exports.PPT = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
let PPT = class PPT extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", String)
], PPT.prototype, "name", void 0);
PPT = __decorate([
    typeorm_1.Entity("Entity"),
    type_graphql_1.ObjectType(),
    type_graphql_1.InputType("EntityInput")
], PPT);
exports.PPT = PPT;
//# sourceMappingURL=PPT.js.map