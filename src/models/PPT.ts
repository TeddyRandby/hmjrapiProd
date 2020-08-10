import { Entity, BaseEntity, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class PPT extends BaseEntity {
    @Field(() => String)
    @PrimaryColumn()
    name: String;
}
