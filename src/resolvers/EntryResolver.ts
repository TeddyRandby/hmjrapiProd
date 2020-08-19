import { Resolver, Query, Mutation, Arg } from "type-graphql";

import { Entry } from "../models/Entry";
import { getMongoRepository } from "typeorm";
import { ExplodeEntriesInput } from "../inputs/ExplodeEntriesInput";
import { explodeEntries } from "../utils/ExplodeEntries";
import { DateInput } from "../inputs/DateInput";
import { EntryInput } from "../inputs/EntryInput";

@Resolver()
export class EntryResolver {
  /* ------ Queries ------ */
  // Grab entries indiscriminantly.
  @Query(() => [Entry])
  async entries(@Arg("max") max: number, @Arg("offset") offset: number) {
    return await getMongoRepository(Entry).find({ take: max, skip: offset });
  }

  // Grab entries with a certain keyword present. TODO: Multiple keywords.
  @Query(() => [Entry])
  async entriesByKeyword(
    @Arg("keyword") data: string,
    @Arg("max") max: number
  ) {
    return await getMongoRepository(Entry).find({
      take: max,
      where: {
        $or: [
          { header: { $regex: new RegExp(data) } },
          { content: { $regex: new RegExp(data) } },
        ],
      },
    });
  }

  // Grab entries within a certain date. TODO: Date range.
  @Query(() => [Entry])
  async entriesByDate(@Arg("date") data: DateInput, @Arg("max") max: number) {
    return await getMongoRepository(Entry).find({
      take: max,
      where: {
        $and: [
          {
            $and: [
              { "minDate.day": { $lte: data.day } },
              { "minDate.month": { $lte: data.month } },
              { "minDate.year": { $lte: data.year } },
            ],
          },
          {
            $and: [
              { "maxDate.day": { $gte: data.day } },
              { "maxDate.month": { $gte: data.month } },
              { "maxDate.year": { $gte: data.year } },
            ],
          },
        ],
      },
    });
  }

  /* ------ Mutations ------ */

  // Explode a box image into the entries as given. Then send those off to NanoNet
  // for an initial entry in the db.
  @Mutation(() => [Entry])
  async explodeEntries(@Arg("data") data: ExplodeEntriesInput) {
    const rawEntries = await explodeEntries(data);
    const entries = getMongoRepository(Entry).create(rawEntries);
    entries.forEach(async (entry) => {
      await entry.save();
    });
    return entries;
  }

  @Mutation(() => Entry)
  async updateEntry(@Arg("id") id: string, @Arg("data") data: EntryInput) {
    const result = await getMongoRepository(Entry).findOneAndReplace(
      {
        where: {
          _id: id,
        },
      },
      {
        book: data.book,
        header: data.header,
        content: data.content,
        dates: data.dates,
        indexes: data.indexes,
        entities: data.entities,
        minDate: data.minDate,
        maxDate: data.maxDate,
      }
    );
    console.log(result);
    return result;
  }
}
