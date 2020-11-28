import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { Entry } from "../models/Entry";
import { Page } from "../models/Page";
import { Date } from "../models/Date";
import { getMongoRepository } from "typeorm";
import { GQLExplodeEntries } from "../graphql/GQLExplodeEntries";
import { explodeEntries } from "../utils/ExplodeEntries";
import { clipBox } from "../utils/ClipBox";
import { ObjectId } from "mongodb";
import {
  parseDateInput,
  parseIndexInput,
  parseEntityInput,
} from "../utils/Promises";
import { BoundingBox } from "../graphql/BoundingBox";
import { explodeBoxes } from "../utils/ExplodeBoxes";
import { cloudExplodeBoxes } from "../utils/CloudExplodeBoxes"
import { GQLClipBox } from "../graphql/GQLClipBox";
import { drawBox } from "../utils/DrawBox";

@Resolver()
export class EntryResolver {
  /* ------ Queries ------ */
  // Need some way to track which is the next page that should be tested.
  // Maybe I should make another store of pages, with ids that lead to entries?

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
  async entriesByDate(@Arg("GQLDate") data: Date, @Arg("max") max: number) {
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

  @Query(() => [BoundingBox])
  async explodeBoxes(@Arg("BoxID") data: string) {
    const boxes = await explodeBoxes(data);
    return boxes;
  }

  @Query(() => String)
  async drawBoxes(@Arg("GQLExplodeEntries") data: GQLExplodeEntries) {
    const status = await drawBox(data);
    return status;
  }

  @Query(() => [BoundingBox])
  async cloudExplodeBoxes(@Arg("BoxID") data: string) {
    const boxes = await cloudExplodeBoxes(data);
    return boxes;
  }

  @Query(() => String)
  async clipBoxes(@Arg("GQLClipBox") data: GQLClipBox) {
    const status = await clipBox(data);
    return status;
  }

  /* ------ Mutations ------ */

  @Mutation(() => [Entry])
  async explodeFull(@Arg("BoxID") data: string, @Arg("BoxName") name: string) {
    const boxes = await explodeBoxes(data);
    const explodeEntriesInput: GQLExplodeEntries = {
      boxID: data,
      boxName: name,
      boundingBoxes: boxes,
    };
    const rawEntries = await explodeEntries(explodeEntriesInput);
    const entries = getMongoRepository(Entry).create(rawEntries);
    const page = getMongoRepository(Page).create({
      boxID: data,
      entries: entries.map((entry) => entry._id),
    });
    await page.save();
    entries.forEach(async (entry) => {
      entry.page = page;
      await entry.save();
    });
    return entries;
  }
  // Explode a box image into the entries as given. Then send those off to NanoNet
  // for an initial entry in the db.
  @Mutation(() => [Entry])
  async explodeEntries(@Arg("GQLExplodeEntries") data: GQLExplodeEntries) {
    const rawEntries = await explodeEntries(data);
    const entries = getMongoRepository(Entry).create(rawEntries);
    const page = getMongoRepository(Page).create({
      boxID: data.boxID,
      entries: entries.map((entry) => entry._id),
    });
    await page.save();
    entries.forEach(async (entry) => {
      entry.page = page;
      await entry.save();
    });
    return entries;
  }

  @Mutation(() => Entry)
  async updateEntry(@Arg("id") id: string, @Arg("GQLEntry") data: Entry) {
    //const replacement = await format(ent, boxID, boxName);
    let original = await getMongoRepository(Entry).findOne({
      where: {
        _id: new ObjectId(id),
      },
    });
    // Switch this to pulling the max and min dates out of dates. (Not Manual)
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
      const result = await original.save();
      return result;
    } else {
      throw "Entry not found";
    }
  }
}
