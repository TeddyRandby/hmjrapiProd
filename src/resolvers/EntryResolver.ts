import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Entry } from "../models/Entry";
import { getMongoRepository } from "typeorm";
import { ExplodeEntriesInput } from "../inputs/ExplodeEntriesInput";
import { explodeEntries } from "../utils/ExplodeEntries";
import { DateInput } from "../inputs/DateInput";
import { EntryInput } from "../inputs/EntryInput";
import { ObjectId } from "mongodb";
import {
  parseDateInput,
  parseIndexInput,
  parseEntityInput,
} from "../utils/Promises";

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
    let parsedData = await parseDateInput(data);
    return await getMongoRepository(Entry).find({
      take: max,
      where: {
        $and: [
          {
            $and: [
              { "minDate.day": { $lte: parsedData.day } },
              { "minDate.month": { $lte: parsedData.month } },
              { "minDate.year": { $lte: parsedData.year } },
            ],
          },
          {
            $and: [
              { "maxDate.day": { $gte: parsedData.day } },
              { "maxDate.month": { $gte: parsedData.month } },
              { "maxDate.year": { $gte: parsedData.year } },
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

  // For some reason the mongoDB ID is funky with typeORM and graphQL.
  // This bug needs to be fixed.
  @Mutation(() => Entry)
  async updateEntry(@Arg("id") id: string, @Arg("data") data: EntryInput) {
    //const replacement = await format(ent, boxID, boxName);
    let original = await getMongoRepository(Entry).findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
    if (original !== undefined) {
      original.book = data.book;
      original.content = data.content;
      original.header = data.header;
      original.dates = await Promise.all(data.dates.map(parseDateInput));
      original.indexes = await Promise.all(data.indexes.map(parseIndexInput));
      original.entities = await Promise.all(
        data.entities.map(parseEntityInput)
      );
      original.maxDate = await parseDateInput(data.maxDate);
      original.minDate = await parseDateInput(data.minDate);
      const result = await original?.save();
      return result;
    } else {
      throw "Entry not found";
    }
  }
}
