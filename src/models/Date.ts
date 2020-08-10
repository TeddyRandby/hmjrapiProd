import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@Entity()
@ObjectType()
export class Date extends BaseEntity {

  @Field(() => Number)
  @Column()
  day: number;

  @Field(() => Number)
  @Column()
  month: number;

  @Field(() => Number)
  @Column()
  year: number;

  @Field(() => String)
  @PrimaryColumn()
  stringified: string;

  @Field(() => String)
  @Column()
  content: string;

}
