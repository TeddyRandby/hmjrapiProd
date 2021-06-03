# Henry Morgenthau JR. Diary Index
Some context about the collection here.

## API
The API uses graphql, so there is only one endpoint:
```https://hmjrapi-prod.herokuapp.com```

There is one query for retrieving entries, fittingly called 'entries'.
It has 4 arguments: 
```
interface EntriesInput {
  max: number // The upper limit of entries to return
  keywords: string[] // An array of strings, at least one of which must be present in the returning entries
  dates: Date[] // An array of dates, which must be included in the returned entries
  books: string[] // An array of books from which entries can be returned
}
```

The date object mentioned previously looks like this:
```
inteface DateInput {
  day: number // Two digits, 1 - 31 for the day
  month: number // Two digits, 1 - 12 for the month
  year: number // Two digits corresponding to a year in the 20th century, ie 43 -> 1943
}
```

The server will respond with an array of entries fitting the query.
```
interface Entry {
  book: string,
  header: string,
  content: string,
  dates: Date[],
  indexes: Index[]
}

interface Date {
  day: number,
  month: number, 
  year: number, // Two digit year again, ie 43 -> 1943
  content: string, // The content of the entry this date is associated with
}

interface Index {
  book: string, // The volume this index refers to
  page: number, // The page in the volume
  content: string // The content of the entry this index is associated with
}
```
