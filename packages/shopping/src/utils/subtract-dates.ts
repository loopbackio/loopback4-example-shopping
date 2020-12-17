// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export const subtractDates = async (dateToSubtract: Date) => {
  const currentDate = new Date(new Date().toLocaleDateString());
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  // Taking into consideration DST. See https://stackoverflow.com/a/15289883/1210717
  const utcCurrentDate = Date.UTC(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDay(),
  );
  const utcDateToSubtract = Date.UTC(
    dateToSubtract.getFullYear(),
    dateToSubtract.getMonth(),
    dateToSubtract.getDay(),
  );
  return Math.floor((utcCurrentDate - utcDateToSubtract) / millisecondsPerDay);
};
