import { Entity, BaseEntity, Column, PrimaryColumn } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";

@Entity()
@ObjectType()
@InputType("DateInput")
export class Date extends BaseEntity {
  @Field(() => Number, { nullable: true})
  @Column()
  day: number;

  @Field(() => Number, { nullable: true})
  @Column()
  month: number;

  @Field(() => Number, { nullable: true})
  @Column()
  year: number;

  @Field(() => String, { nullable: true})
  @PrimaryColumn()
  stringified: string;

  @Field(() => String, { nullable: true })
  @Column()
  content: string;
}
