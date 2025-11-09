import { getPriceAlert } from "./getPriceAler";

describe("getPriceAlert", () => {
  it("should return undefined when price change is below threshold", () => {
    const result = getPriceAlert(100, 102, 5);
    expect(result).toBeUndefined();
  });

  it("should return positive percentage when price increases above threshold", () => {
    const result = getPriceAlert(100, 110, 5);
    expect(result).toBe(10);
  });

  it("should return negative percentage when price decreases above threshold", () => {
    const result = getPriceAlert(100, 90, 5);
    expect(result).toBe(-10);
  });

  it("should handle edge case where previous price is zero", () => {
    const result = getPriceAlert(0, 100, 5);
    expect(result).toBeUndefined(); // Division by zero case
  });

  it("should return percentage with two decimal places", () => {
    const result = getPriceAlert(100, 107.567, 5);
    expect(result).toBe(7.57);
  });
});
