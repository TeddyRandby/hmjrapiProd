import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm";
import { ObjectType, Field, InputType, Float } from "type-graphql";

@Entity()
@ObjectType()
@InputType("IndexInput")
export class Index extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryColumn()
  content: string;

  @PrimaryColumn()
  stringified: string;

  @Field(() => String, {nullable: true})
  @Column()
  book: string;

  @Field(() => Float, { nullable: true })
  @Column()
  page: number;
}
