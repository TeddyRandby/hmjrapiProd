import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Entry } from "../models/Entry";
import { Date } from "../models/Date";
import { getMongoRepository } from "typeorm";
import { findLeastDate, findGreatestDate } from "../utils/utils"

@Resolver()
export class EntryResolver {
  /* ------ Queries ------ */
  // Need some way to track which is the next page that should be tested.
  // Maybe I should make another store of pages, with ids that lead to entries?

  // Grab entries indiscriminantly.
  @Query(() => [Entry])
  async entries(@Arg("max") max: number,@Arg("offset") offset: number) {
    return await getMongoRepository(Entry).find({ take: max, skip: offset });
  }

  // Quick fix for entries where Index wasn't parsed correctly.
  @Query(() => [Entry])
  async entriesByBoxID(@Arg("id") id: string) {
    let entries = await getMongoRepository(Entry).find({
      where: {
        boxID: { $eq: id }        
      }
    })
    return entries.map(entry=>({...entry, indexes: entry.indexes.map(index=>({...index, stringified: index.page.toString()}))}));
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
  async entriesByDate(@Arg("date") date: Date, @Arg("max") max: number) {
    return await getMongoRepository(Entry).find({
      take: max,
      where: {
        $and: [
          {
            $and: [
              { "minDate.day": { $lte: date.day } },
              { "minDate.month": { $lte: date.month } },
              { "minDate.year": { $lte: date.year } },
            ],
          },
          {
            $and: [
              { "maxDate.day": { $gte: date.day } },
              { "maxDate.month": { $gte: date.month } },
              { "maxDate.year": { $gte: date.year } },
            ],
          },
        ],
      },
    });
  }

  @Query(() => [Entry])
  async entriesByBook(@Arg("book") book: string, @Arg("max") max: number) {
    return await getMongoRepository(Entry).find({
      take: max,
      where: {
        book: book 
      }
    });
  }

  /* ------ Mutations ------ */

  /*
   * Update a single entry
   */
  @Mutation(() => Entry)
  async updateEntry(@Arg("id") id: string, @Arg("entry") entry: Entry) {
    let original = await getMongoRepository(Entry).findOne(id);

    if (!original)
      return original

    if (entry.header)
      original.header = entry.header;

    if (entry.content)
      original.content = entry.content;

    if (entry.book)
      original.book = entry.book;

    if (entry.dates) {
      original.dates = entry.dates;

      let least = findLeastDate(entry.dates);
      if (least)
        original.minDate = least;

      let greatest = findGreatestDate(entry.dates);
      if (greatest)
        original.maxDate = greatest;
    }

    if (entry.indexes)
      original.indexes = entry.indexes;

    await original.save();

    return original;
  }

  /*
   * Update all entries associated with a certain boxID page
   */
  @Mutation(() => [Entry])
  async updatePage(@Arg("id") id: string, @Arg("entry") entry: Entry) {
    //const replacement = await format(ent, boxID, boxName);
    let original = await getMongoRepository(Entry).find({
      where: {
        boxID: id 
      }
    });

    console.log(entry);

    // Switch this to pulling the max and min dates out of dates. (Not Manual)

    return original;

    } 
  
}
