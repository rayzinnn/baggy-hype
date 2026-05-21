export function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalDateRange(from?: string, to?: string, fallbackDays = 30) {
  const now = new Date();
  const fallbackFrom = new Date(now);
  fallbackFrom.setDate(now.getDate() - fallbackDays);

  const fromDate = from ? new Date(`${from}T00:00:00`) : fallbackFrom;
  const toDate = to ? new Date(`${to}T23:59:59.999`) : now;

  return {
    from: fromDate,
    to: toDate,
    fromValue: toDateInputValue(fromDate),
    toValue: toDateInputValue(toDate),
  };
}

export function dayKey(date: Date) {
  return toDateInputValue(date);
}
