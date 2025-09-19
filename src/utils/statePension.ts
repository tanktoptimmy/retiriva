// UK State Pension Age Calculator
// Based on current UK government rules as of 2024

export type PensionInfo = {
  pensionAge: number;   // in years
  pensionDate: Date;    // exact date they can claim
};

/**
 * Calculate UK State Pension Age and claim date (current rules as of 2024).
 * 
 * @param dob Date of birth
 * @returns PensionInfo object with pensionAge and pensionDate
 */
export function calculateStatePensionAge(dob: Date): PensionInfo {

  // Timetable for pension age changes
  // Source: gov.uk (https://assets.publishing.service.gov.uk/media/5a7f02e640f0b62305b84929/spa-timetable.pdf)
  // Simplified to main rules
  const ranges: { start: Date; end: Date; pensionAge: number | ((dob: Date) => number) }[] = [
    // Born before 6 April 1960 -> 66
    { start: new Date(1900, 0, 1), end: new Date(1960, 3, 5), pensionAge: 66 },

    // Born 6 April 1960 – 5 March 1961 -> gradual increase from 66y + 1m up to 66y + 11m
    {
      start: new Date(1960, 3, 6),
      end: new Date(1961, 2, 5),
      pensionAge: (dob) => {
        // Each month of DOB adds 1 extra month to 66 years
        const monthsAfterApril1960 =
          (dob.getFullYear() - 1960) * 12 + (dob.getMonth() - 3); // April = 3
        return 66 + monthsAfterApril1960 / 12;
      },
    },

    // Born 6 March 1961 – 5 April 1977 -> 67
    { start: new Date(1961, 2, 6), end: new Date(1977, 3, 5), pensionAge: 67 },

    // Born after 5 April 1977 -> 67 (future rises to 68 between 2044–2046 not yet applied here)
    { start: new Date(1977, 3, 6), end: new Date(2010, 11, 31), pensionAge: 67 },
  ];

  // Find the correct pension age rule
  const rule = ranges.find(r => dob >= r.start && dob <= r.end);

  if (!rule) {
    // Default to 67 for anyone born outside our defined ranges
    console.warn(`DOB outside supported range, defaulting to age 67. DOB: ${dob.toISOString()}`);
    const pensionAge = 67;
    const pensionDate = new Date(dob);
    pensionDate.setFullYear(dob.getFullYear() + pensionAge);
    return { pensionAge, pensionDate };
  }

  // Resolve pension age
  const pensionAge =
    typeof rule.pensionAge === "function"
      ? rule.pensionAge(dob)
      : rule.pensionAge;

  // Calculate pension date
  const pensionDate = new Date(dob);
  pensionDate.setFullYear(dob.getFullYear() + Math.floor(pensionAge));

  // If pensionAge includes fractional years (e.g., 66.25 = 66y + 3m)
  const fractionalYears = pensionAge - Math.floor(pensionAge);
  if (fractionalYears > 0) {
    const extraMonths = Math.round(fractionalYears * 12);
    pensionDate.setMonth(pensionDate.getMonth() + extraMonths);
  }

  return { pensionAge, pensionDate };
}

/**
 * Get the current full state pension amount for UK (2024/25 rates)
 * This is in today's money and will be inflation-adjusted in the calculations
 */
export function getCurrentStatePensionAmount(): number {
  // UK State Pension 2024/25 full amount per year
  return 11502;
}

/**
 * Example usage and testing function
 */
export function testStatePensionCalculations() {
  const testCases = [
    new Date("1960-06-15"), // Should be ~66.25 years
    new Date("1965-01-01"), // Should be 67
    new Date("1990-05-20"), // Should be 67
  ];

  console.log("State Pension Age Test Results:");
  testCases.forEach((dob, index) => {
    const result = calculateStatePensionAge(dob);
    console.log(`Test ${index + 1}: Born ${dob.toDateString()}`);
    console.log(`  Pension Age: ${result.pensionAge} years`);
    console.log(`  Pension Date: ${result.pensionDate.toDateString()}`);
    console.log();
  });
}
