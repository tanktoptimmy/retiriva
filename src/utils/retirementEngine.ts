// retirementCalculator.ts
// Complete, self-contained retirement calculator (daily simulation + binary search to earliest-safe retirement day)

// ------------------- Interfaces -------------------
export type Region = "UK" | "US";

export interface RegionalConfig {
  currency: string; // currency symbol for display
  currencySymbol: string;
  currencyCode: string;
  statePensionAge: number; // renamed for consistency
  statePensionAmount: number; // renamed for consistency 
  pensionName: string;
  inflationRate: number; // typical inflation rate for region
  expectedReturn: number; // typical investment return for region
  desiredAnnualIncome: number; // typical desired income for region
}

export interface SimpleRetirementInput {
  dateOfBirth: Date;
  region: Region; // Required: UK or US
  currentSavings: number;
  monthlySavings: number;
  savingsStopAge: number;
  deathAge: number;
  desiredAnnualIncome: number; // in today's money
  inflationRate: number; // as percentage (e.g. 2.5)
  expectedReturn: number; // as percentage (e.g. 5.5)
  statePensionAge: number; // pension eligibility age
  statePensionAnnual: number; // annual pension amount (in local currency) before inflation  
  statePensionPercentage: number; // percent of full pension (0-100)
  // Coffee/Daily expense analysis
  dailyExpenseAmount?: number; // daily expense amount (e.g. coffee cost). Positive reduces balance (expense). Use negative to mean investing instead.
  workingDaysPerWeek?: number; // working days per week for the expense
  vacationDaysPerYear?: number; // vacation/holiday days per year when expense doesn't occur
  // Inflation adjustments
  adjustSavingsForInflation?: boolean; // whether to increase savings by inflation rate
}

export interface YearlyProjection {
  year: number;
  age: number;
  startBalance: number;
  contributions: number;
  growth: number;
  withdrawals: number;
  statePensionIncome: number;
  endBalance: number;
}

export interface RetirementScenario {
  retirementDate: Date;
  retirementAge: number;
  runOutDate: Date | null;
  survivedToDeath: boolean;
  finalBalanceAtDeath: number;
}

export interface SimpleRetirementResult {
  canRetireAt: number | null; // integer years old (aligned to projection row)
  retirementDate: Date | null; // exact day
  projections: YearlyProjection[]; // aggregated per calendar year up to death year
  totalSavingsAtRetirement: number; // exact pot on retirement day (preferred) or projection.startBalance fallback
  yearsOfRetirement: number;
  runOutDate: Date | null; // if retirement occurs earlier and pot hits zero, first run-out day
  formData: SimpleRetirementInput;
  scenarios: RetirementScenario[]; // small curated scenario list
}

export interface CoffeeVsInvestmentComparison {
  withCoffee: SimpleRetirementResult;
  withoutCoffee: SimpleRetirementResult;
  impact: {
    retirementAgeImprovement: number; // years earlier retirement is possible
    retirementDateImprovement: number; // days earlier retirement is possible
    totalSavingsImprovement: number; // additional savings at retirement
    annualCoffeeSpending: number; // total annual coffee spending
    yearsOfCoffeeSpending: number; // years until retirement age
    totalCoffeeSpendingUntilRetirement: number;
  };
}

// ------------------- Helpers -------------------
function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}
function daysInYear(y: number): number {
  return isLeapYear(y) ? 366 : 365;
}
function daysBetween(d1: Date, d2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((d2.getTime() - d1.getTime()) / msPerDay);
}
function addDays(d: Date, days: number): Date {
  const r = new Date(d.getTime());
  r.setDate(r.getDate() + days);
  return r;
}
function calculateAge(dob: Date, asOf: Date): number {
  let age = asOf.getFullYear() - dob.getFullYear();
  const md = asOf.getMonth() - dob.getMonth();
  if (md < 0 || (md === 0 && asOf.getDate() < dob.getDate())) age--;
  return age;
}
// ------------------- Regional configurations -------------------
export const REGIONAL_CONFIGS: Record<Region, RegionalConfig> = {
  UK: {
    currency: '£',
    currencySymbol: '£',
    currencyCode: 'GBP',
    statePensionAge: 66,
    statePensionAmount: 11504, // 2024/25 full UK State Pension
    pensionName: 'State Pension',
    inflationRate: 2.0, // UK long-term average
    expectedReturn: 5.0, // Conservative UK investment return
    desiredAnnualIncome: 30000, // typical UK desired retirement income
  },
  US: {
    currency: '$',
    currencySymbol: '$',
    currencyCode: 'USD', 
    statePensionAge: 67,
    statePensionAmount: 24000, // Realistic US Social Security estimate
    pensionName: 'Social Security',
    inflationRate: 2.5, // US long-term average
    expectedReturn: 6.0, // Conservative US investment return
    desiredAnnualIncome: 50000, // typical US desired retirement income
  },
};

export function getRegionalConfig(region: Region): RegionalConfig {
  return REGIONAL_CONFIGS[region];
}

/**
 * Create default SimpleRetirementInput values based on region
 */
export function createDefaultRetirementInput(region: Region, dateOfBirth: Date): SimpleRetirementInput {
  const config = getRegionalConfig(region);
  
  return {
    region,
    dateOfBirth,
    currentSavings: 0,
    monthlySavings: 500,
    savingsStopAge: 65,
    deathAge: 85,
    desiredAnnualIncome: config.desiredAnnualIncome,
    inflationRate: config.inflationRate,
    expectedReturn: config.expectedReturn,
    statePensionAge: config.statePensionAge,
    statePensionAnnual: config.statePensionAmount,
    statePensionPercentage: 100,
    adjustSavingsForInflation: true,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCurrentStatePensionAmount(): number {
  return 11504; // fallback / default UK 2024/25 full amount
}
function getDailyReturnFromAnnual(annualPct: number): number {
  return Math.pow(1 + annualPct / 100, 1 / 365) - 1;
}
function startOfDay(d: Date): Date {
  const r = new Date(d.getTime());
  r.setHours(0, 0, 0, 0);
  return r;
}

// ------------------- Core: daily simulation (single run) -------------------
function simulateDailyUntilDeathOnce(
  input: SimpleRetirementInput,
  retirementStartDayOffset: number
): {
  yearlyProjections: YearlyProjection[];
  finalBalanceAtDeath: number;
  firstRunOutDate: Date | null;
  dayBalances?: Map<number, number>;
} {
  const today = startOfDay(new Date());
  const birth = input.dateOfBirth;
  // Set death date to the end of the death age year (the day before they turn deathAge + 1)
  const deathDate = new Date(birth);
  deathDate.setFullYear(birth.getFullYear() + input.deathAge + 1);
  deathDate.setDate(deathDate.getDate() - 1);
  const totalDays = daysBetween(today, deathDate);
  
  const dailyReturn = getDailyReturnFromAnnual(input.expectedReturn);
  console.log('Daily Return Calculation:', {
    expectedReturnPercent: input.expectedReturn,
    dailyReturn: dailyReturn,
    dailyReturnPercent: (dailyReturn * 100).toFixed(6) + '%',
    annualCompoundCheck: Math.pow(1 + dailyReturn, 365) - 1
  });
  
  const annualInflation = input.inflationRate / 100;
  
  // Use regional pension configuration
  const baseStatePensionAnnual = input.statePensionAnnual;
  const pensionPercentage = input.statePensionPercentage;
  const baseStatePension = baseStatePensionAnnual * (pensionPercentage / 100);

  let balance = input.currentSavings;
  let firstRunOutDate: Date | null = null;
  const dayBalances = new Map<number, number>();
  const yearMap = new Map<number, YearlyProjection>();

  for (let dayIdx = 0; dayIdx <= totalDays; dayIdx++) {
    const currentDate = addDays(today, dayIdx);
    const year = currentDate.getFullYear();
    const age = calculateAge(birth, currentDate);

    // Ensure year entry exists
    if (!yearMap.has(year)) {
      yearMap.set(year, {
        year,
        age,
        startBalance: balance,
        contributions: 0,
        growth: 0,
        withdrawals: 0,
        statePensionIncome: 0,
        endBalance: balance,
      });
    }
    const proj = yearMap.get(year)!;

    // Calculate inflation factor for this point in time
    const yearsSinceNow = dayIdx / 365.25;
    const inflFactor = Math.pow(1 + annualInflation, yearsSinceNow);

    // Contributions (with optional inflation adjustment)
    if (age < input.savingsStopAge && input.monthlySavings > 0) {
      let monthlySavingsAmount = input.monthlySavings;
      if (input.adjustSavingsForInflation) {
        monthlySavingsAmount = input.monthlySavings * inflFactor;
      }
      const perDay = (monthlySavingsAmount * 12) / daysInYear(year);
      balance += perDay;
      proj.contributions += perDay;
    }

    // Daily expenses (with inflation adjustment)
    if (input.dailyExpenseAmount && input.workingDaysPerWeek && age < input.savingsStopAge) {
      const currentDay = currentDate.getDay(); // 0=Sunday, 1=Monday, etc.
      const workingDaysPerWeek = Math.min(input.workingDaysPerWeek, 7);
      
      // For 5 days or less, use Mon-Fri (1-5)
      // For 6 days, use Mon-Sat (1-6)
      // For 7 days, use every day (0-6)
      let isExpenseDay = false;
      if (workingDaysPerWeek === 7) {
        isExpenseDay = true; // Every day
      } else if (workingDaysPerWeek === 6) {
        isExpenseDay = currentDay >= 1 && currentDay <= 6; // Monday to Saturday
      } else {
        // 5 days or less - use weekdays, starting from Monday
        isExpenseDay = currentDay >= 1 && currentDay <= workingDaysPerWeek;
      }
      
      if (isExpenseDay) {
        // Apply inflation to coffee expense (or investment if negative)
        const inflatedExpense = input.dailyExpenseAmount * inflFactor;
        balance -= inflatedExpense; // If negative dailyExpenseAmount, this becomes an addition
        // Track this as negative contribution for expenses, positive for investments
        proj.contributions -= inflatedExpense;
      }
    }

    // Withdrawals
    if (dayIdx >= retirementStartDayOffset) {
      const desiredAnnualInflAdj = input.desiredAnnualIncome * inflFactor;

      let statePensionPerDay = 0;
      let withdrawPerDay = desiredAnnualInflAdj / daysInYear(year);

      if (age >= input.statePensionAge) {
        const adjStateAnnual = baseStatePension * inflFactor;
        statePensionPerDay = adjStateAnnual / daysInYear(year);
        withdrawPerDay = Math.max(0, desiredAnnualInflAdj - adjStateAnnual) / daysInYear(year);
      }

      // Continue withdrawals and state pension even if balance is zero or negative
      balance -= withdrawPerDay;
      proj.withdrawals += withdrawPerDay;
      proj.statePensionIncome += statePensionPerDay;
    }

    // Growth (only apply if balance is positive)
    const growth = balance > 0 ? balance * dailyReturn : 0;
    balance += growth;
    proj.growth += growth;
    proj.endBalance = balance;

    // record day balance
    dayBalances.set(dayIdx, balance);

    if (balance <= 0 && firstRunOutDate === null) {
      firstRunOutDate = new Date(currentDate);
    }
  }

  // Build yearly projections
  const startYear = new Date().getFullYear();
  // Calculate end year based on when person reaches deathAge
  const deathAgeYear = birth.getFullYear() + input.deathAge;
  const endYear = deathAgeYear;
  const yearlyProjections: YearlyProjection[] = [];

  // Calculate current age to use as baseline
  const currentAge = calculateAge(input.dateOfBirth, today);
  const currentYear = today.getFullYear();
  
  for (let y = startYear; y <= endYear; y++) {
    const e = yearMap.get(y);
    // Calculate age based on current age + years elapsed from current year
    const yearsFromNow = y - currentYear;
    const ageForYear = currentAge + yearsFromNow;
    
    if (e) {
      // For the death age year, use the final balance from the simulation
      const endBalance = (y === endYear) ? balance : e.endBalance;
      
      yearlyProjections.push({
        year: e.year,
        age: ageForYear,
        startBalance: Number(e.startBalance.toFixed(2)),
        contributions: Number(e.contributions.toFixed(2)),
        growth: Number(e.growth.toFixed(2)),
        withdrawals: Number(e.withdrawals.toFixed(2)),
        statePensionIncome: Number(e.statePensionIncome.toFixed(2)),
        endBalance: Number(endBalance.toFixed(2)), // can be negative
      });
    } else {
      yearlyProjections.push({
        year: y,
        age: ageForYear,
        startBalance: 0,
        contributions: 0,
        growth: 0,
        withdrawals: 0,
        statePensionIncome: 0,
        endBalance: 0,
      });
    }
  }

  return {
    yearlyProjections,
    finalBalanceAtDeath: Number(balance.toFixed(2)),
    firstRunOutDate,
    dayBalances,
  };
}

// ------------------- Efficient search -------------------
function findLatestRetirementDayOffset(
  input: SimpleRetirementInput
): { foundOffset: number | null; simForFound: ReturnType<typeof simulateDailyUntilDeathOnce> | null } {
  console.log('\n### BINARY SEARCH FOR OPTIMAL RETIREMENT DATE ###');
  
  const today = startOfDay(new Date());
  const birth = input.dateOfBirth;
  // Set death date to the end of the death age year (the day before they turn deathAge + 1)
  const deathDate = new Date(birth);
  deathDate.setFullYear(birth.getFullYear() + input.deathAge + 1);
  deathDate.setDate(deathDate.getDate() - 1);
  const totalDays = daysBetween(today, deathDate);

  console.log('Binary Search Setup:', {
    totalDays: totalDays,
    totalYears: Math.round(totalDays / 365.25)
  });

  // Check if retiring at the very end still leaves positive balance
  console.log('Testing retirement at very end (offset=', totalDays, ')...');
  const finalSim = simulateDailyUntilDeathOnce(input, totalDays);
  console.log('Final simulation result:', {
    finalBalanceAtDeath: finalSim.finalBalanceAtDeath,
    runOutDate: finalSim.firstRunOutDate
  });
  
  if (finalSim.finalBalanceAtDeath < 0) {
    console.log('❌ Cannot retire even at the very end - insufficient funds!');
    return { foundOffset: null, simForFound: null };
  }
  
  console.log('✅ Can retire at the very end, starting binary search...');

  // Binary search to find the LATEST retirement date where balance is still >= -50000
  // (allowing some negative balance but not complete depletion)
  let lo = 0;
  let hi = totalDays;
  let foundOffset: number | null = null;
  let bestSim: ReturnType<typeof simulateDailyUntilDeathOnce> | null = null;
  let iteration = 0;

  console.log('Starting main binary search (target: balance between -50k and 50k)...');
  while (lo <= hi) {
    iteration++;
    const mid = Math.floor((lo + hi) / 2);
    const sim = simulateDailyUntilDeathOnce(input, mid);
    
    console.log(`Iteration ${iteration}: offset=${mid} days (${Math.round(mid/365.25)}y), balance=${sim.finalBalanceAtDeath.toFixed(2)}, lo=${lo}, hi=${hi}`);
    
    // Accept if balance is between -50000 and 50000 (close to zero)
    if (sim.finalBalanceAtDeath >= -50000 && sim.finalBalanceAtDeath <= 50000) {
      foundOffset = mid;
      bestSim = sim;
      console.log(`  ✅ ACCEPTED: Balance ${sim.finalBalanceAtDeath.toFixed(2)} is in target range [-50k, 50k]`);
      // Try to find an even later retirement date (smaller offset = later retirement)
      hi = mid - 1;
    } else if (sim.finalBalanceAtDeath > 50000) {
      // Too much money left, can retire later (reduce offset)
      console.log(`  📈 Too much money left (${sim.finalBalanceAtDeath.toFixed(2)}), can retire later`);
      hi = mid - 1;
    } else {
      // Too negative, need to retire earlier (increase offset)
      console.log(`  📉 Too negative (${sim.finalBalanceAtDeath.toFixed(2)}), need to retire earlier`);
      lo = mid + 1;
    }
  }

  if (foundOffset !== null && bestSim) {
    return { foundOffset, simForFound: bestSim };
  }

  // Fallback: find the earliest retirement where balance >= 0
  lo = 0;
  hi = totalDays;
  
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sim = simulateDailyUntilDeathOnce(input, mid);
    if (sim.finalBalanceAtDeath >= 0) {
      hi = mid;
      foundOffset = mid;
    } else {
      lo = mid + 1;
    }
  }

  if (foundOffset !== null) {
    const verifySim = simulateDailyUntilDeathOnce(input, foundOffset);
    return { foundOffset, simForFound: verifySim };
  }

  return { foundOffset: null, simForFound: null };
}

// ------------------- Public API -------------------
export function calculateSimpleRetirement(input: SimpleRetirementInput): SimpleRetirementResult {
  console.log('=== RETIREMENT CALCULATION STARTED ===');
  console.log('Form Data Input:', {
    dateOfBirth: input.dateOfBirth,
    region: input.region,
    currentSavings: input.currentSavings,
    monthlySavings: input.monthlySavings,
    savingsStopAge: input.savingsStopAge,
    deathAge: input.deathAge,
    desiredAnnualIncome: input.desiredAnnualIncome,
    inflationRate: input.inflationRate,
    expectedReturn: input.expectedReturn,
    statePensionAge: input.statePensionAge,
    statePensionAnnual: input.statePensionAnnual,
    statePensionPercentage: input.statePensionPercentage,
    adjustSavingsForInflation: input.adjustSavingsForInflation
  });
  
  const today = startOfDay(new Date());
  const birth = input.dateOfBirth;
  const currentAge = calculateAge(birth, today);
  
  console.log('Dates & Age:', {
    today: today,
    birth: birth,
    currentAge: currentAge
  });
  
  // Set death date to the end of the death age year (the day before they turn deathAge + 1)
  const deathDate = new Date(birth);
  deathDate.setFullYear(birth.getFullYear() + input.deathAge + 1);
  deathDate.setDate(deathDate.getDate() - 1);
  const totalDays = daysBetween(today, deathDate);
  
  console.log('Death Planning:', {
    deathDate: deathDate,
    totalDays: totalDays,
    yearsUntilDeath: Math.round(totalDays / 365.25)
  });

  console.log('\n--- STARTING RETIREMENT DATE SEARCH ---');
  const { foundOffset, simForFound } = findLatestRetirementDayOffset(input);
  
  console.log('Search Results:', {
    foundOffset: foundOffset,
    foundOffsetDays: foundOffset,
    foundOffsetYears: foundOffset ? Math.round(foundOffset / 365.25) : null,
    finalBalance: simForFound?.finalBalanceAtDeath,
    firstRunOutDate: simForFound?.firstRunOutDate
  });

  // Build scenarios list
  const offsetsToShow = new Set<number>();
  offsetsToShow.add(0);
  offsetsToShow.add(Math.min(totalDays, 30));
  offsetsToShow.add(Math.min(totalDays, 90));
  offsetsToShow.add(Math.min(totalDays, 180));
  offsetsToShow.add(Math.min(totalDays, 365));
  offsetsToShow.add(Math.min(totalDays, 365 * 3));
  offsetsToShow.add(Math.min(totalDays, 365 * 5));
  if (foundOffset !== null) offsetsToShow.add(foundOffset);
  const offsets = Array.from(offsetsToShow).map(o => Math.max(0, Math.min(totalDays, o))).sort((a, b) => a - b);

  const scenarios: RetirementScenario[] = offsets.map(o => {
    const sim = simulateDailyUntilDeathOnce(input, o);
    const date = addDays(today, o);
    return {
      retirementDate: date,
      retirementAge: calculateAge(birth, date),
      runOutDate: sim.firstRunOutDate,
      survivedToDeath: sim.finalBalanceAtDeath >= 0,
      finalBalanceAtDeath: sim.finalBalanceAtDeath,
    };
  });

  if (foundOffset !== null && simForFound) {
    const retirementDate = addDays(today, foundOffset);
    const retirementYear = retirementDate.getFullYear();
    const projForRetirementYear = simForFound.yearlyProjections.find(p => p.year === retirementYear);

    let exactSavingsAtRetirement = input.currentSavings;
    if (simForFound.dayBalances) {
      const val = simForFound.dayBalances.get(foundOffset);
      if (typeof val === 'number') exactSavingsAtRetirement = Number(val.toFixed(2));
    }

    const retirementAgeAligned = projForRetirementYear ? projForRetirementYear.age : calculateAge(birth, retirementDate);

    return {
      canRetireAt: retirementAgeAligned,
      retirementDate,
      projections: simForFound.yearlyProjections,
      totalSavingsAtRetirement: exactSavingsAtRetirement ?? (projForRetirementYear?.startBalance ?? input.currentSavings),
      yearsOfRetirement: Math.max(0, input.deathAge - retirementAgeAligned),
      runOutDate: simForFound.firstRunOutDate,
      formData: input,
      scenarios,
    };
  }

  const fallbackSim = simulateDailyUntilDeathOnce(input, totalDays);
  return {
    canRetireAt: null,
    retirementDate: null,
    projections: fallbackSim.yearlyProjections,
    totalSavingsAtRetirement: input.currentSavings,
    yearsOfRetirement: 0,
    runOutDate: fallbackSim.firstRunOutDate,
    formData: input,
    scenarios,
  };
}

// ------------------- Coffee vs Investment Analysis -------------------
export function compareCoffeeVsInvestment(
  input: SimpleRetirementInput
): CoffeeVsInvestmentComparison | null {
  // Ensure we have the required coffee expense fields
  if (!input.dailyExpenseAmount || !input.workingDaysPerWeek) {
    return null;
  }

  // Calculate scenario with coffee expenses
  const withCoffee = calculateSimpleRetirement(input);
  
  // Calculate scenario without coffee expenses (invested instead)
  const inputWithoutCoffee: SimpleRetirementInput = {
    ...input,
    dailyExpenseAmount: input.dailyExpenseAmount ? -input.dailyExpenseAmount : undefined, // Negative means investment
    workingDaysPerWeek: input.workingDaysPerWeek,
  };
  const withoutCoffee = calculateSimpleRetirement(inputWithoutCoffee);
  
  // Calculate the impact
  const today = startOfDay(new Date());
  const currentAge = calculateAge(input.dateOfBirth, today);
  
  // Calculate annual coffee spending accounting for vacation days
  const dailyExpense = input.dailyExpenseAmount;
  const workingDaysPerWeek = Math.min(input.workingDaysPerWeek, 7);
  const vacationDays = input.vacationDaysPerYear || 0;
  const baseAnnualExpenseDays = workingDaysPerWeek * 52;
  const actualAnnualExpenseDays = Math.max(0, baseAnnualExpenseDays - vacationDays);
  const annualCoffeeSpending = dailyExpense * actualAnnualExpenseDays;
  
  // Calculate years of coffee spending (until retirement age with coffee or savings stop age)
  const retirementAge = withCoffee.canRetireAt ?? input.savingsStopAge;
  const yearsOfCoffeeSpending = Math.max(0, retirementAge - currentAge);
  const totalCoffeeSpendingUntilRetirement = annualCoffeeSpending * yearsOfCoffeeSpending;
  
  // Calculate improvements (without coffee should allow earlier retirement)
  // If withCoffee.canRetireAt = 67 and withoutCoffee.canRetireAt = 66, improvement = 67 - 66 = 1 year
  const retirementAgeImprovement = withCoffee.canRetireAt && withoutCoffee.canRetireAt 
    ? withCoffee.canRetireAt - withoutCoffee.canRetireAt 
    : 0;
  
  // Calculate days improvement (positive means you can retire earlier without coffee)
  const retirementDateImprovement = withCoffee.retirementDate && withoutCoffee.retirementDate
    ? daysBetween(withoutCoffee.retirementDate, withCoffee.retirementDate)
    : 0;
  
  const totalSavingsImprovement = withoutCoffee.totalSavingsAtRetirement - withCoffee.totalSavingsAtRetirement;
  
  return {
    withCoffee,
    withoutCoffee,
    impact: {
      retirementAgeImprovement,
      retirementDateImprovement,
      totalSavingsImprovement,
      annualCoffeeSpending,
      yearsOfCoffeeSpending,
      totalCoffeeSpendingUntilRetirement,
    },
  };
}
