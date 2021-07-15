import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {getMongoRepository} from "typeorm";
import {Date} from "../models/Date";
import {Entry} from "../models/Entry";
import {getVolumeDownloadURL} from "../utils/Promises";
import {
  findBooks,
  findGreatestDate,
  findLeastDate,
  validateAuthor
} from "../utils/utils"

    @Resolver() export class
EntryResolver {
  /* ------ Queries ------ */

  @Query(() => [Entry]) async entries(
      @Arg("max", {defaultValue : 50}) max: number,
      @Arg("clean", {defaultValue : false}) clean: boolean,
      @Arg("keywords", _ => [String], {defaultValue : []}) keywords: string[],
      @Arg("dates", _ => [Date], {defaultValue : []}) dates: Date[],
      @Arg("books", _ => [String], {defaultValue : []}) books: string[]) {
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

  @Query(() => String) async volume(
      @Arg("volume") vol: string) { return await getVolumeDownloadURL(vol);}

  /* ------ Mutations ------ */
  /*
   * Create a new, blank entry and return it.
   */
  @Mutation(() => Entry) async createEntry(@Arg("author") author: string,
                                           @Arg("book") book: string) {
    if (!validateAuthor(author))
      return null;
    return await getMongoRepository(Entry)
        .create({
          book,
          header : "",
          content : "",
          dates : [],
          indexes : [],
          mostRecentAuthor : author
        })
        .save();
  }

  /*
   * Delete an entry and return the number of deleted entries
   * For some reason this returns an empty object. dk why.
   */
  @Mutation(() => Number) async deleteEntry(@Arg("id") id: string,
                                            @Arg("author") author: string) {
    if (!validateAuthor(author))
      return 0;
    const result = await getMongoRepository(Entry).delete(id);
    return result.affected || 0;
  }

  /*
   * Update a single entry
   * Return true if successful.
   */
  @Mutation(() => String) async updateEntry(@Arg("id") id: string,
                                            @Arg("author") author: string,
                                            @Arg("entry") entry: Entry) {
    if (!validateAuthor(author))
      return "Invalid Author";

    let original = await getMongoRepository(Entry).findOne(id);

    if (!original)
      return "Invalid id";

    original.mostRecentAuthor = author;

    if (entry.dates) {
      original.dates = entry.dates;

      original.minDate = findLeastDate(entry.dates) || original.minDate;

      original.maxDate = findGreatestDate(entry.dates) || original.maxDate;
    }

    original.header = entry.header || original.header;

    original.content = entry.content || original.content;

    original.book = entry.book || original.book;

    original.indexes = entry.indexes || original.indexes;

    original.people = entry.people || original.people;

    original.locations = entry.locations || original.locations;

    original.organizations = entry.organizations || original.organizations;

    original.tags = entry.tags || original.tags;

    if (await original.save())
      return "Updated entry";
    else
      return "Could not save entry";
  }
}
