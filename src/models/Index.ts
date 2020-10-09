import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType()
@InputType("GQLIndex")
export class Index extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryColumn()
  content: string;

  @Field(() => String, { nullable: true })
  @PrimaryColumn()
  stringified: string;

  @Field(() => Number)
  @Column()
  book: number;

  @Field(() => Number, { nullable: true })
  @Column()
  page: number;
}
