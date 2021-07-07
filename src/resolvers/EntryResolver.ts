import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {getMongoRepository} from "typeorm";

import {Date} from "../models/Date";
import {Entry} from "../models/Entry";
import {getVolumeDownloadURL} from "../utils/Promises";
import {
  findBooks,
  findGreatestDate,
  findLeastDate
} from "../utils/utils"

    @Resolver() export class
EntryResolver {
  /* ------ Queries ------ */

  @Query(() => [Entry])
  async entries(@Arg("max", {defaultValue : 50}) max: number,
                @Arg("clean", {defaultValue : false}) clean: boolean,
                @Arg("keywords", () => [String]) keywords: string[],
                @Arg("dates", () => [Date]) dates: Date[],
                @Arg("books", () => [String]) books: string[]) {
    let entries;

    let newBooks = findBooks(clean, books)

    if (!newBooks) {
      return []
    }

    books = newBooks;

    if (dates.length > 0) {
      const minDate = findLeastDate(dates) ?? {
        day: 100, month: 100, year: 100
      }
      const maxDate = findGreatestDate(dates)
          ?? {day : 0, month : 0, year : 0}

             entries = await getMongoRepository(Entry).find({
               take : max,
               where : {
                 $and : [
                   {book : {$regex : new RegExp(books.join('|') || /./g)}},
                   {
                     $or : [
                       {
                         header :
                             {$regex : new RegExp(keywords.join('|') || /./g)}
                       },
                       {
                         content :
                             {$regex : new RegExp(keywords.join('|') || /./g)}
                       },
                     ]
                   },
                   {
                     $or : [
                       {
                         $and : [
                           {"minDate.day" : {$lte : maxDate.day}},
                           {"minDate.month" : {$lte : maxDate.month}},
                           {"minDate.year" : {$lte : maxDate.year}},
                           {"minDate.day" : {$gte : minDate.day}},
                           {"minDate.month" : {$gte : minDate.month}},
                           {"minDate.year" : {$gte : minDate.year}},
                         ],
                       },
                       {
                         $and : [
                           {"maxDate.day" : {$lte : minDate.day}},
                           {"maxDate.month" : {$lte : minDate.month}},
                           {"maxDate.year" : {$lte : minDate.year}},
                           {"maxDate.day" : {$gte : maxDate.day}},
                           {"maxDate.month" : {$gte : maxDate.month}},
                           {"maxDate.year" : {$gte : maxDate.year}},
                         ],
                       },
                     ],
                   },
                 ]
               }
             })
    } else {
      entries = await getMongoRepository(Entry).find({
        take : max,
        where : {
          $and : [
            {book : {$regex : new RegExp(books.join('|') || /./g)}},
            {
              $or : [
                {header : {$regex : new RegExp(keywords.join('|') || /./g)}},
                {content : {$regex : new RegExp(keywords.join('|') || /./g)}},
              ]
            },
          ]
        }
      })
    }

    return entries.map(entry => ({
                         ...entry,
                         indexes : entry.indexes.map(
                             index => ({
                               ...index,
                               book : index.book ? index.book : entry.book,
                               page : index.page ? index.page : "NaN"
                             }))
                       }));
  }

  @Query(() => String) async volume(
      @Arg("volume") vol: string) { return await getVolumeDownloadURL(vol);}

  // Quick fix for entries where Index wasn't parsed correctly.
  @Query(() => [Entry]) async entriesByBoxID(@Arg("id") id: string) {
    let entries =
        await getMongoRepository(Entry).find({where : {boxID : {$eq : id}}})
    return entries.map(
        entry => ({
          ...entry,
          indexes : entry.indexes.map(index => ({
                                        ...index,
                                        book : entry.book,
                                        stringified : index.page.toString()
                                      }))
        }));
  }

  // Grab entries with a certain keyword present. TODO: Multiple keywords.
  @Query(() => [Entry])
  async entriesByKeyword(@Arg("keyword", () => [String]) keywords: [ string ],
                         @Arg("max") max: number) {
    return await getMongoRepository(Entry).find({
      take : max,
      where : {
        $or : [
          {header : {$regex : new RegExp(keywords.join('|'))}},
          {content : {$regex : new RegExp(keywords.join('|'))}},
        ],
      },
    });
  }

  // Grab entries within a certain date. TODO: Date range.
  @Query(() => [Entry]) async entriesByDate(@Arg("date") date: Date,
                                            @Arg("max") max: number) {
    return await getMongoRepository(Entry).find({
      take : max,
      where : {
        $and : [
          {
            $and : [
              {"minDate.day" : {$lte : date.day}},
              {"minDate.month" : {$lte : date.month}},
              {"minDate.year" : {$lte : date.year}},
            ],
          },
          {
            $and : [
              {"maxDate.day" : {$gte : date.day}},
              {"maxDate.month" : {$gte : date.month}},
              {"maxDate.year" : {$gte : date.year}},
            ],
          },
        ],
      },
    });
  }

  @Query(() => [Entry]) async entriesByBook(
      @Arg("book", () => [String]) books: [ string ], @Arg("max") max: number) {
    let entries = await getMongoRepository(Entry).find(
        {take : max, where : {book : {$regex : new RegExp(books.join('|'))}}});

    return entries.map(entry => ({
                         ...entry,
                         indexes : entry.indexes.map(
                             index => ({
                               ...index,
                               book : index.book ? index.book : entry.book,
                               page : index.page ? index.page : "NaN"
                             }))
                       }));
  }

  /* ------ Mutations ------ */
  // Comment out mutations. DB should be static now

  /*
   * Create a new, blank entry and return it.
   */
  @Mutation(() => Entry) async createEntry(@Arg("book") book: string) {
    return await getMongoRepository(Entry)
        .create({book, header : "", content : "", dates : [], indexes : []})
        .save();
  }

  /*
   * Delete an entry and return the number of deleted entries
   * For some reason this returns an empty object. dk why.
   */
  @Mutation(() => Number) async deleteEntry(@Arg("id") id: string) {
    const result = await getMongoRepository(Entry).delete(id);
    return result.affected || 0;
  }

  /*
   * Update a single entry
   */
  @Mutation(() => Boolean) async updateEntry(@Arg("id") id: string,
                                             @Arg("entry") entry: Entry) {
    let original = await getMongoRepository(Entry).findOne(id);

    if (!original)
      return false;

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

    if (entry.people)
      original.people = entry.people;

    if (entry.locations)
      original.locations = entry.locations;

    if (entry.organizations)
      original.organizations = entry.organizations;

    if (await original.save())
      return true;
    else
      return false;
  }

  /*
   * Update all entries associated with a certain boxID page
   */
  //   @Mutation(() => [Entry]) async updatePage(@Arg("id") id: string,
  //                                             @Arg("entry") entry: Entry) {
  //     // const replacement = await format(ent, boxID, boxName);
  //     let original = await getMongoRepository(Entry).find({where : {boxID : id}});
  //
  //     console.log(entry);
  //
  //     // Switch this to pulling the max and min dates out of dates. (Not Manual)
  //
  //     return original;
  //   }

}
