import { InputType, Field } from "type-graphql";

@InputType("DateInput")
export class DateInput {
  @Field()
  stringified: string;

  @Field()
  content: string;
}
