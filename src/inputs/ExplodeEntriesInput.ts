import { InputType, Field } from "type-graphql";
import { BoundingBoxInput } from "./BoundingBoxInput";

@InputType("ExplodeEntriesInput")
export class ExplodeEntriesInput {
  @Field()
  boxID: string;

  @Field()
  boxName: string;

  @Field(() => [BoundingBoxInput])
  boundingBoxes: [BoundingBoxInput];
}

