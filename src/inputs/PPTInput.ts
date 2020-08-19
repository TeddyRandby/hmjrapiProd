import { Field, InputType } from "type-graphql";

@InputType("PPTInput")
export class PPTInput {
  @Field()
  name: String;
}
