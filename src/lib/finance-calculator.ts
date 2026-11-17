export interface FinancialCalculationInput {
  sellerPurchasePrice: number;
  buyerSalePrice: number;
  depositAmount: number;
  depositStatus: string; // NOT_PAID | AWAITING_VERIFICATION | VERIFIED_PAID | REFUNDED
  remainingPaymentStatus: string; // NOT_PAID | VERIFIED_PAID
  shippingCost: number;
  inspectionCost: number;
  repairCost: number;
  taxAndOtherCosts: number;
  isCompleted: boolean;
}

export interface FinancialCalculationOutput {
  remainingAmount: number;
  totalExpenses: number;
  estimatedGrossProfit: number;
  estimatedNetProfit: number;
  actualGrossProfit: number;
  actualNetProfit: number;
}

export function calculateFinancialSummary(
  input: FinancialCalculationInput
): FinancialCalculationOutput {
  const sellerPurchasePrice = Math.max(0, Number(input.sellerPurchasePrice) || 0);
  const buyerSalePrice = Math.max(0, Number(input.buyerSalePrice) || 0);
  const depositAmount = Math.max(0, Number(input.depositAmount) || 0);

  const shippingCost = Math.max(0, Number(input.shippingCost) || 0);
  const inspectionCost = Math.max(0, Number(input.inspectionCost) || 0);
  const repairCost = Math.max(0, Number(input.repairCost) || 0);
  const taxAndOtherCosts = Math.max(0, Number(input.taxAndOtherCosts) || 0);

  const totalExpenses =
    shippingCost + inspectionCost + repairCost + taxAndOtherCosts;

  const estimatedGrossProfit = buyerSalePrice - sellerPurchasePrice;
  const estimatedNetProfit = estimatedGrossProfit - totalExpenses;

  // Honest payment rule: only VERIFIED_PAID deposits reduce the remaining amount due
  const verifiedDeposit =
    input.depositStatus === 'VERIFIED_PAID' ? depositAmount : 0;

  const remainingAmount =
    input.remainingPaymentStatus === 'VERIFIED_PAID'
      ? 0
      : Math.max(0, buyerSalePrice - verifiedDeposit);

  // Actual profit is realized only when transaction is completed (or both payments verified)
  const isRealized =
    input.isCompleted || input.remainingPaymentStatus === 'VERIFIED_PAID';

  const actualGrossProfit = isRealized ? estimatedGrossProfit : 0;
  const actualNetProfit = isRealized ? estimatedNetProfit : 0;

  return {
    remainingAmount,
    totalExpenses,
    estimatedGrossProfit,
    estimatedNetProfit,
    actualGrossProfit,
    actualNetProfit,
  };
}
