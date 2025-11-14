// Calculator Types and Constants

export interface CalculatorInput {
  usdPrice: number;
  profitMargin: number;
  paymentMode: "cash" | "card";
  productDescription: string;
}

export interface InstallmentPlan {
  months: number;
  bankFee: number;
  monthlyPayment: number;
  totalAmount: number;
}

export interface CalculatorResult {
  basePriceGTQ: number;
  salesPrice: number;
  priceWithIVA: number;
  installmentPlans: InstallmentPlan[];
}

// Constants
export const EXCHANGE_RATE = 8.0;
export const IVA_RATE = 0.12;
export const EXTRA_FEE = 1.61;

// Bank fees by installment months
export const BANK_FEES: Record<number, number> = {
  2: 8.68,
  3: 9.24,
  6: 10.64,
  10: 10.92,
  12: 11.76,
  18: 15.12,
  24: 16.8,
};

export const INSTALLMENT_MONTHS = [2, 3, 6, 10, 12, 18, 24];

// Calculator Functions
export function calculatePrices(input: CalculatorInput): CalculatorResult {
  const { usdPrice, profitMargin, paymentMode } = input;

  // Base conversion
  const basePriceGTQ = usdPrice * EXCHANGE_RATE;

  // Sales price with profit margin
  const salesPrice = basePriceGTQ / (1 - profitMargin / 100);

  // Price with IVA (only for card payments)
  const priceWithIVA = paymentMode === "card" ? salesPrice * (1 + IVA_RATE) : salesPrice;

  // Calculate installment plans (only for card payments)
  const installmentPlans: InstallmentPlan[] =
    paymentMode === "card"
      ? INSTALLMENT_MONTHS.map((months) => {
          const bankFee = BANK_FEES[months];
          const totalFee = bankFee + EXTRA_FEE;
          const totalAmount = priceWithIVA / (1 - totalFee / 100);
          const monthlyPayment = totalAmount / months;

          return {
            months,
            bankFee,
            monthlyPayment,
            totalAmount,
          };
        })
      : [];

  return {
    basePriceGTQ,
    salesPrice,
    priceWithIVA,
    installmentPlans,
  };
}

export function formatCurrency(amount: number): string {
  return `Q ${amount.toFixed(2)}`;
}
