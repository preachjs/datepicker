export function getDaysOfMonthAndYear(month, year) {
  return new Date(year, month, 0).getDate();
}

export function generateListOfDaysForMonthAndYear(
  month,
  year,
  { locale = undefined } = {}
) {
  const weekdayList = getWeekdayList(locale);
  const lastDay = getDaysOfMonthAndYear(month + 1, year);
  const dates = range(1, lastDay).map((d) => {
    return new Date(year, month, d);
  });

  const startIndex = weekdayList.findIndex(
    (d) => d === formatToWeekday(dates[0], locale, {})
  );
  let currIndex = startIndex;
  let missingStartIndices = range(0, startIndex);
  const daysArray = new Array(7 * 6).fill(-1);

  missingStartIndices.forEach((value, index) => {
    const d = new Date(dates[0]);
    d.setDate(d.getDate() + (index - startIndex));
    daysArray[value] = {
      previousMonth: true,
      date: d,
    };
  });

  dates.forEach((d, i) => {
    daysArray[currIndex++] = {
      date: d,
    };
  });

  let lastIndex = currIndex - 1;
  daysArray.slice(currIndex).forEach((_, i) => {
    const prevItem = daysArray[lastIndex];
    const currentDate = new Date(prevItem.date);
    currentDate.setDate(currentDate.getDate() + 1);
    daysArray[++lastIndex] = {
      nextMonth: true,
      date: currentDate,
    };
  });

  return daysArray.reduce((acc, item, index) => {
    const rowIndex = Math.floor(index / 7);
    return (acc[rowIndex] || (acc[rowIndex] = [])).push(item), acc;
  }, []);
}

export function getMonthAndYearFromDate(date) {
  return Intl.DateTimeFormat("en-gb", {
    dateStyle: "medium",
  })
    .format(date)
    .split(" ")
    .slice(1)
    .join(" ");
}

export function range(start, end) {
  if (end === undefined || end === null) {
    end = start;
    start = 0;
  }
  return new Array(end).fill(0).map((_, i) => start + i);
}

export function getWeekdayList(locale, options) {
  const arr = new Array(7);
  range(7).forEach((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    arr[d.getDay()] = formatToWeekday(d, locale, options);
  });
  return arr;
}

export function formatToWeekday(date, locale = "en-gb", options = {}) {
  return Intl.DateTimeFormat(locale, {
    weekday: options.format || "short",
  }).format(date);
}

export function formatToReadableDate(date, locale = "en-gb") {
  return Intl.DateTimeFormat(locale).format(date);
}
