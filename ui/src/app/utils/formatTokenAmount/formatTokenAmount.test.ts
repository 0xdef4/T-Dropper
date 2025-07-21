import { test, expect, describe } from "vitest";
import { formatTokenAmount } from "./formatTokenAmount";

describe("formatTokenAmount", () => {
  test("1. Formats integer value with 18 decimals", () => {
    expect(formatTokenAmount(1000000000000000000, 18)).toBe("1.00");
  });

  test("2. Formats small value correctly", () => {
    expect(formatTokenAmount(1234, 6)).toBe("0.00");
  });

  test("3. Formats large number with commas", () => {
    expect(formatTokenAmount(1234567890000000000000, 18)).toBe("1,234.57");
  });

  test("4. Rounds down correctly", () => {
    expect(formatTokenAmount(123456789, 8)).toBe("1.23");
  });

  test("5. Rounds up correctly", () => {
    expect(formatTokenAmount(129999999, 8)).toBe("1.30");
  });

  test("6. Works with 0 input", () => {
    expect(formatTokenAmount(0, 18)).toBe("0.00");
  });

  test("7. Works with different decimal places (e.g. 6)", () => {
    expect(formatTokenAmount(2500000, 6)).toBe("2.50");
  });

  test("8. Handles values less than 1 token", () => {
    expect(formatTokenAmount(500000000000000000, 18)).toBe("0.50");
  });

  test("9. Maximum fraction digits capped at 2", () => {
    expect(formatTokenAmount(1234567, 3)).toBe("1,234.57");
  });

  test("10. Formats correctly with unusual decimal value", () => {
    expect(formatTokenAmount(123456, 2)).toBe("1,234.56");
  });
});
