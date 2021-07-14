import {Date} from "../models/Date";
export function findLeastDate(dates: Date[]): Date|null {
  if (dates.length < 1)
    return null
    return dates.reduce((acc, curr) =>
                            dateLessThanOrEqualTo(acc, curr) ? acc : curr)
}

export function findGreatestDate(dates: Date[]): Date|null {
  if (dates.length < 1)
    return null;
  return dates.reduce((acc, curr) =>
                          dateGreaterThanOrEqualTo(acc, curr) ? acc : curr)
}

export function dateLessThanOrEqualTo(a: Date, b: Date): boolean {
  if (a.year < b.year) {
    return true;
  } else if (a.year == b.year && a.month < b.month) {
    return true;
  } else if (a.month == b.month && a.day <= b.day) {
    return true;
  } else {
    return false;
  }
}

export function dateGreaterThanOrEqualTo(a: Date, b: Date): boolean {
  if (a.year > b.year) {
    return true;
  } else if (a.year == b.year && a.month > b.month) {
    return true;
  } else if (a.month == b.month && a.day >= b.day) {
    return true;
  } else {
    return false;
  }
}

let CleanBooks: string[] = [];
for (let i = 689; i < 749; i++) {
  CleanBooks.push(`${i}`);
}

export function findBooks(clean: boolean, books: string[]): string[]|null {
  if (clean) {
    if (books.length > 0) {
      books = books.filter((book) => CleanBooks.includes(book))
      return books.length ? books : null;
    } else {
      return CleanBooks
    }
  } else {
    return books;
  }
}

export function validateAuthor(author: string): boolean {
  return [ "tedrandby@gmail.com" ].includes(author);
}
