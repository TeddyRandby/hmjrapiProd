import { Field, InputType } from "type-graphql";

@InputType("IndexInput")
export class IndexInput {
  @Field()
  content: string;

  @Field()
  book: number;

  @Field()
  page: number;
}
