function isStringParsableToNumber(str) {
  const num = parseFloat(str);
  return !isNaN(num) && Number.isFinite(num);
}

export const processVacantNumber = (v: number | string) => {
  return typeof v === 'number'
    ? (v / 100).toFixed(2) + '%'
    : isStringParsableToNumber(v)
    ? parseFloat(v).toFixed(2) + '%'
    : v;
};
