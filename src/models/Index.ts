import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class Index extends BaseEntity {

    
    @Field(() => String)
    @PrimaryColumn()
    content: string;

    @Field(() => Number)
    @Column()
    book: number;

    @Field(() => Number)
    @Column()
    page: number;

}
