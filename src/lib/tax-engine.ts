// Ethiopian Tax Calculation Engine
// Based on ERCA (Ethiopian Revenue & Customs Authority) regulations
// Proclamation No. 979/2016 — Income Tax Amendment

/**
 * Ethiopian Individual Income Tax Brackets (Monthly)
 * Per ERCA regulations — progressive rates
 */
interface TaxBracket {
  upTo: number | null; // null = no upper limit
  rate: number; // percentage
  baseTax: number; // cumulative tax from lower brackets
}

// 2024/2025 brackets (monthly ETB)
export const incomeTaxBrackets: TaxBracket[] = [
  { upTo: 600, rate: 0, baseTax: 0 },         // 0% — below 600
  { upTo: 1650, rate: 10, baseTax: 0 },        // 10% — 601 to 1650
  { upTo: 3200, rate: 15, baseTax: 105 },      // 15% — 1651 to 3200
  { upTo: 5250, rate: 20, baseTax: 337.5 },    // 20% — 3201 to 5250
  { upTo: 7800, rate: 25, baseTax: 747.5 },    // 25% — 5251 to 7800
  { upTo: null, rate: 30, baseTax: 1385 },     // 30% — above 7800
];

/**
 * Calculate individual income tax (Pay-As-You-Earn) for monthly salary
 * @param taxableIncome - monthly taxable income after pension deduction
 * @returns tax amount in ETB
 */
export function calculateIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of incomeTaxBrackets) {
    if (bracket.upTo === null || taxableIncome <= bracket.upTo) {
      const lowerLimit = getLowerLimit(bracket);
      const taxableInBracket = taxableIncome - lowerLimit;
      return bracket.baseTax + (taxableInBracket * bracket.rate) / 100;
    }
  }
  return 0;
}

function getLowerLimit(bracket: TaxBracket): number {
  const idx = incomeTaxBrackets.indexOf(bracket);
  if (idx === 0) return 0;
  return incomeTaxBrackets[idx - 1].upTo ?? 0;
}

/**
 * Pension contribution rates (Ethiopian Social Security Agency)
 * Employee: 7% of gross salary
 * Employer: 11% of gross salary
 */
export const PENSION_EMPLOYEE_RATE = 7;
export const PENSION_EMPLOYER_RATE = 11;

/**
 * VAT rate — 15% standard (Proclamation No. 577/2008)
 */
export const VAT_RATE = 15;

/**
 * Withholding tax rates
 * Payment to suppliers: 2%
 * Import payments: 3%
 * Rent: 2%
 */
export const WITHHOLDING_TAX_PAYMENT = 2;
export const WITHHOLDING_TAX_IMPORT = 3;

/**
 * Turnover tax — 2% for non-VAT registered businesses
 */
export const TURNOVER_TAX_RATE = 2;

/**
 * Business income tax — 30% corporate rate
 */
export const BUSINESS_INCOME_TAX_RATE = 30;

/**
 * Complete payroll calculation for an Ethiopian employee
 * @param grossSalary - monthly gross salary in ETB
 * @returns detailed breakdown
 */
export interface PayrollCalculation {
  grossSalary: number;
  pensionEmployee: number; // 7%
  pensionEmployer: number; // 11%
  taxableIncome: number;   // gross - pension
  incomeTax: number;       // PAYE
  totalDeductions: number; // pension + tax
  netPay: number;
  costToCompany: number;   // gross + employer pension
}

export function calculatePayroll(grossSalary: number): PayrollCalculation {
  const pensionEmployee = Math.round((grossSalary * PENSION_EMPLOYEE_RATE) / 100);
  const pensionEmployer = Math.round((grossSalary * PENSION_EMPLOYER_RATE) / 100);
  const taxableIncome = grossSalary - pensionEmployee;
  const incomeTax = Math.round(calculateIncomeTax(taxableIncome));
  const totalDeductions = pensionEmployee + incomeTax;
  const netPay = grossSalary - totalDeductions;
  const costToCompany = grossSalary + pensionEmployer;

  return {
    grossSalary,
    pensionEmployee,
    pensionEmployer,
    taxableIncome,
    incomeTax,
    totalDeductions,
    netPay,
    costToCompany,
  };
}

/**
 * Calculate VAT on a sale
 * @param amount - net amount (before VAT)
 * @returns VAT amount (15% of net)
 */
export function calculateVAT(amount: number): number {
  return Math.round((amount * VAT_RATE) / 100);
}

/**
 * Calculate total with VAT
 */
export function calculateTotalWithVAT(amount: number): number {
  return amount + calculateVAT(amount);
}

/**
 * Extract net amount from VAT-inclusive total
 */
export function extractNetFromVATInclusive(vatInclusive: number): number {
  return Math.round(vatInclusive / (1 + VAT_RATE / 100));
}

/**
 * Withholding tax calculation
 */
export function calculateWithholdingTax(amount: number, type: "payment" | "import" = "payment"): number {
  const rate = type === "import" ? WITHHOLDING_TAX_IMPORT : WITHHOLDING_TAX_PAYMENT;
  return Math.round((amount * rate) / 100);
}

/**
 * Get income tax bracket info for display
 */
export function getTaxBracketInfo(taxableIncome: number) {
  for (const bracket of incomeTaxBrackets) {
    if (bracket.upTo === null || taxableIncome <= bracket.upTo) {
      return {
        rate: bracket.rate,
        baseTax: bracket.baseTax,
        lowerLimit: getLowerLimit(bracket),
        upperLimit: bracket.upTo,
      };
    }
  }
  return { rate: 0, baseTax: 0, lowerLimit: 0, upperLimit: 0 };
}

/**
 * Calculate annual tax projection
 */
export function calculateAnnualProjection(monthlyGross: number) {
  const monthly = calculatePayroll(monthlyGross);
  return {
    annualGross: monthlyGross * 13, // 12 months + 13th month (Ethiopian practice)
    annualPension: monthly.pensionEmployee * 12,
    annualTax: monthly.incomeTax * 12,
    annualNet: monthly.netPay * 12 + monthly.netPay, // includes 13th month
  };
}
