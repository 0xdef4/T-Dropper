// calculateTotal.test.ts

import { test, expect, describe } from "vitest";
import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  test("1. Calculates total from comma-separated numbers", () => {
    expect(calculateTotal("1,2,3")).toBe(6);
  });

  test("2. Calculates total from newline-separated numbers", () => {
    expect(calculateTotal("4\n5\n6")).toBe(15);
  });

  test("3. Calculates total from mixed comma and newline separators", () => {
    expect(calculateTotal("1.5,\n2.5\n3")).toBeCloseTo(7.0);
  });

  test("4. Trims whitespace correctly around values", () => {
    expect(calculateTotal(" 1 , 2 \n 3 ")).toBe(6);
  });

  test("5. Returns 0 for empty string", () => {
    expect(calculateTotal("")).toBe(0);
  });

  test("6. Returns 0 if non-numeric string is included", () => {
    expect(calculateTotal("1,2,three")).toBe(0);
  });

  test("7. Returns 0 if NaN is present in input", () => {
    expect(calculateTotal("1\nNaN\n2")).toBe(0);
  });

  test("8. Ignores empty values between delimiters", () => {
    expect(calculateTotal("1,,2\n\n3")).toBe(6);
  });

  test("9. Calculates total for decimal and integer mix", () => {
    expect(calculateTotal("1.1,2,3.3")).toBeCloseTo(6.4);
  });

  test("10. Handles negative numbers correctly", () => {
    expect(calculateTotal("10,-2,3")).toBe(11);
  });
});
