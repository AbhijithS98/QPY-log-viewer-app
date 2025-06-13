export function convertToIST(utcTime) {
  const date = new Date(utcTime);
  const options = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true
  };
  const parts = new Intl.DateTimeFormat("en-IN", options).formatToParts(date);

  const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

  return `${partMap.month} ${partMap.day} - ${partMap.year}, ${partMap.hour}:${partMap.minute}:${partMap.second} ${partMap.dayPeriod.toLowerCase()}`;
}
