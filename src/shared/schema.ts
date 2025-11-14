import { z } from "zod";

// Calculator types
export const calculatorInputSchema = z.object({
  basePrice: z.number().min(0, "Price must be positive"),
  profitPercent: z.number().min(0).max(99, "Profit must be between 0 and 99"),
  description: z.string().optional(),
  paymentType: z.enum(["efectivo", "tarjeta"]),
});

export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export interface InstallmentPlan {
  cuotas: number;
  porcBanco: number;
}

export interface CalculationResult {
  baseQ: number;
  precioVenta: number;
  precioIVA: number;
  installments: InstallmentResult[];
}

export interface InstallmentResult {
  cuotas: number;
  montoPorCuota: number;
}

// Installment configuration constants
export const INSTALLMENT_PLANS: InstallmentPlan[] = [
  { cuotas: 2, porcBanco: 8.68 },
  { cuotas: 3, porcBanco: 9.24 },
  { cuotas: 6, porcBanco: 10.64 },
  { cuotas: 10, porcBanco: 10.92 },
  { cuotas: 12, porcBanco: 11.76 },
  { cuotas: 18, porcBanco: 15.12 },
  { cuotas: 24, porcBanco: 16.8 },
];

export const EXTRA_FEE_PERCENT = 1.61;
export const EXCHANGE_RATE = 8;
export const IVA_PERCENT = 12;
