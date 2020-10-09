import { InputType, Field } from "type-graphql";
import { BoundingBox } from "./BoundingBox";

@InputType("GQLExplodeEntries")
export class GQLExplodeEntries {
  @Field()
  boxID: string;

  @Field()
  boxName: string;

  @Field(() => [BoundingBox])
  boundingBoxes: BoundingBox[];
}
