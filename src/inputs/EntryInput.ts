import { DateInput } from "./DateInput";
import { IndexInput } from "./IndexInput";
import { PPTInput } from "./PPTInput";
import { Field, InputType } from "type-graphql";
@InputType("EntryInput")
export class EntryInput {
  @Field()
  book: string;

  @Field()
  header: string;

  @Field()
  content: string;

  @Field(() => [DateInput])
  dates: DateInput[];

  @Field(() => [IndexInput])
  indexes: IndexInput[];

  @Field(() => [PPTInput])
  entities: PPTInput[];

  @Field(() => DateInput)
  minDate: DateInput;

  @Field(() => DateInput)
  maxDate: DateInput;
}
