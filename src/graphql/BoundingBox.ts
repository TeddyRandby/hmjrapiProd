import { InputType, Field, ObjectType } from "type-graphql";

@ObjectType()
@InputType("GQLBoundingBox")
export class BoundingBox {
  @Field()
  left: number;

  @Field()
  width: number;

  @Field()
  top: number;

  @Field()
  height: number;
}
