import { InputType, Field } from "type-graphql";

@InputType()
export class BoundingBoxInput {
    
    @Field()
    xMin: number;

    @Field()
    xMax: number;

    @Field()
    yMin: number;

    @Field()
    yMax: number;
}