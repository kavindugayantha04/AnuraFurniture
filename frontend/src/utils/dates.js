export const FOUNDING_YEAR = 2010;

/** Last revision date for Terms & Privacy pages */
export const POLICY_LAST_UPDATED = new Date(2026, 4, 29);

export function getCurrentYear() {
  return new Date().getFullYear();
}

export function getYearsInBusiness() {
  return getCurrentYear() - FOUNDING_YEAR;
}

export function formatLongDate(date = new Date(), locale = 'en-US') {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
