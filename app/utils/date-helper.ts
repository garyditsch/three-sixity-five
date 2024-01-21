// Get the day of the year

// https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
// link above was solution needed to deal with typescript errors getting time difference
export function getDayOfYear(dateString: Date) {
    const startOfYear = new Date(dateString.getFullYear(), 0, 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((dateString.getTime() - startOfYear.getTime()) / millisecondsPerDay) + 1;
  }
