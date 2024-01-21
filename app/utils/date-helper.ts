// Get the day of the year

// https://stackoverflow.com/questions/36560806/the-left-hand-side-of-an-arithmetic-operation-must-be-of-type-any-number-or
// link above was solution needed to deal with typescript errors getting time difference
export function getDayOfYear(dateString: Date) {
    const startOfYear = new Date(dateString.getFullYear(), 0, 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((dateString.getTime() - startOfYear.getTime()) / millisecondsPerDay) + 1;
  }


  export const getDaysInYear = (year: number) => {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      return 366; // Leap year
    }
    return 365; // Non-leap year
  }

// getMonthDayYear function returns a date object with the day of week, month, day, year
// Sun Jan 21 2024 00:00:00 GMT-0500 (Eastern Standard Time)
export const getMonthDayYear = (day: number, year: number) => {
  const date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}
