function _seasonYearRange() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const nextYear = currentYear + 1;

  // Get the last two digits of the next year
  const nextYearLastTwoDigits = String(nextYear).slice(-2);

  // Combine the current year and the last two digits of the next year
  const result = `${currentYear}-${nextYearLastTwoDigits}`;

  return result;
}

export const seasonYearRange = _seasonYearRange();
