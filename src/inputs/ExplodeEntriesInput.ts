
import { InputType, Field } from "type-graphql";
import { Entry } from "../models/Entry";
import { BoundingBoxInput } from './BoundingBoxInput'

@InputType()
export class ExplodeEntriesInput implements Partial<Entry>{

    @Field()
    boxID: string;

    @Field(()=>[BoundingBoxInput])
    boundingBoxes: [BoundingBoxInput]
}