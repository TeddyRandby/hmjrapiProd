import { InputType, Field } from "type-graphql";

@InputType("DateInput")
export class DateInput {
  @Field()
  day: number;

  @Field()
  month: number;

  @Field()
  year: number;

  @Field()
  stringified: string;

  @Field()
  content: string;
}

