import { Field, InputType } from "type-graphql";

@InputType("IndexInput")
export class IndexInput {
  @Field()
  content: string;

  @Field()
  stringified: string;
}
