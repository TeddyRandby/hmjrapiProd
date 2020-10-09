
import { InputType, Field } from "type-graphql";
import { BoundingBox } from "./BoundingBox";

@InputType("GQLClipBox")
export class GQLClipBox {
    @Field()
    boxID: string;

    @Field(() => [BoundingBox])
    boundingBoxes: BoundingBox[];
}
