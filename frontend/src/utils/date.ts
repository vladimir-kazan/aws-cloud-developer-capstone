export const formatToShortDate = (date: Date): string => {
  const { language = 'en-US' } = navigator;
  const dtf = new Intl.DateTimeFormat(language, { year: 'numeric', month: 'short', day: 'numeric' });
  const [{ value: month },,{ value: day },,{ value: year }] = dtf.formatToParts(date);
  return `${day} ${month} ${year}`;
};
