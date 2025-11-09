export const getPriceAlert = (
  previousPrice: number,
  newPrice: number,
  changeRangePercent: number
): number | undefined => {
  if (previousPrice !== 0) {
    const difference = newPrice - previousPrice;
    const percentage = (difference / previousPrice) * 100;

    if (Math.abs(percentage) >= changeRangePercent) {
      return parseFloat(percentage.toFixed(2));
    }
  }

  return undefined;
};
