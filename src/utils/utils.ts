import { Date } from "../models/Date";

export function findLeastDate(dates: Date[]): Date | null {
  if (dates.length < 1) 
    return null
  return dates.reduce((acc, curr)=>dateLessThanOrEqualTo(acc, curr) ? acc : curr)
}

export function findGreatestDate(dates: Date[]): Date | null {
  if (dates.length < 1) 
    return null;
  return dates.reduce((acc, curr)=>dateGreaterThanOrEqualTo(acc, curr) ? acc : curr)
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
