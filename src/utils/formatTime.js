export const timeList = [
  'Today',
  'Yesterday',
  'Last 1 Week',
  'Last 1 Month',
  'Last 1 Quarter',
  'Last 1 Year',
  'Time Custom',
];

export function getFormatTime(timeOption) {
  const now = new Date();
  let date = now.getDate();
  let month = now.getMonth();
  let fullYear = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();

  const monthNowString = month + 1 < 10 ? `0${month + 1}` : month + 1;
  const dateNowString = date < 10 ? `0${date}` : date;
  const hourString = hour < 10 ? `0${hour}` : hour;
  const minuteString = minute < 10 ? `0${minute}` : minute;
  let toDate = `${fullYear}-${monthNowString}-${dateNowString}T${hourString}:${minuteString}`;

  switch (timeOption) {
    case timeList[1]: {
      toDate = `${fullYear}-${monthNowString}-${dateNowString}T00:00`;

      const yesterday = new Date(now.setDate(now.getDate() - 1));
      fullYear = yesterday.getFullYear();
      month = yesterday.getMonth();
      date = yesterday.getDate();
      break;
    }
    case timeList[2]: {
      const dateLastWeek = new Date(fullYear, month, date - 7);
      fullYear = dateLastWeek.getFullYear();
      month = dateLastWeek.getMonth();
      date = dateLastWeek.getDate();
      break;
    }
    case timeList[3]: {
      const lastDateOfLastMonth = new Date(fullYear, month, 0).getDate();
      if (date > lastDateOfLastMonth) {
        date = lastDateOfLastMonth;
      }
      fullYear = month ? fullYear : fullYear - 1;
      month = month ? month - 1 : 11;
      break;
    }
    case timeList[4]: {
      fullYear = month - 3 < 0 ? fullYear - 1 : fullYear;
      month = month - 3 < 0 ? 12 + month - 3 : month - 3;

      const lastDateOf3LastMonth = new Date(fullYear, month + 1, 0).getDate();
      if (date > lastDateOf3LastMonth) {
        date = lastDateOf3LastMonth;
      }
      break;
    }
    case timeList[5]: {
      fullYear -= 1;
      const lastDateOfLastYear = new Date(fullYear, month + 1, 0).getDate();
      if (date > lastDateOfLastYear) {
        date = lastDateOfLastYear;
      }
      break;
    }
    default:
      break;
  }

  month += 1;
  const monthString = month < 10 ? `0${month}` : month;
  const dateString = date < 10 ? `0${date}` : date;
  const fullDate = `${fullYear}-${monthString}-${dateString}`;

  return { fromDate: `${fullDate}T00:00`, toDate };
}
