import { Date } from "../models/Date";

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
