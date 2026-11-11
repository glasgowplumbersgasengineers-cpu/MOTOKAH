import { describe, it, expect } from "vitest";
import { _parseMgayaPrice } from "./mockData";

// Regression tests for the Instagram-caption price parser. These captions come almost verbatim
// from real showroom JSON files (src/data/showrooms/*.json) and previously produced wildly wrong
// prices — including a Toyota Harrier priced at 20.5 BILLION instead of 20.5 million TZS.
describe("_parseMgayaPrice", () => {
  it("parses a plain millions-suffixed price correctly", () => {
    expect(_parseMgayaPrice("63m")).toBe(63_000_000);
    expect(_parseMgayaPrice("24.8 Milion")).toBe(24_800_000);
  });

  it("parses a fully-written-out price with commas correctly", () => {
    expect(_parseMgayaPrice("20,500,000")).toBe(20_500_000);
  });

  it("does not multiply an already-complete price by a million when a stray 'm'/'million' word follows it (Toyota Harrier bug)", () => {
    // Real caption: "TOYOTA HARRIER NO,DQP\nPrice milion 20,500,000/-\n..."
    // The word "milion" here is a label, not a x1,000,000 multiplier — the number after it is
    // already the full TZS price. Previously this parsed to 20,500,000 * 1,000,000.
    expect(_parseMgayaPrice("20,500,000m")).toBe(20_500_000);
    // Real caption: "...Price : 40800000 m + registration"
    expect(_parseMgayaPrice("40800000m")).toBe(40_800_000);
    // Real caption: "BEI/PRICE 49,800,000 MILLIONS ... Price 49,800,000ml only"
    expect(_parseMgayaPrice("49,800,000ml")).toBe(49_800_000);
  });

  it("treats a European-style decimal comma as a decimal point, not a thousands separator", () => {
    // Real caption: "- price 42,5 million" (Toyota Harrier 240L, breemotors showroom) meant
    // 42.5 million, but a naive comma-strip parsed "42,5" -> "425" -> 425,000,000 (10x too high).
    expect(_parseMgayaPrice("42,5 million")).toBe(42_500_000);
    // Real caption: "Toyota Harrier\n...\nPrice 42,8" (urassa_motors) meant 42.8 million.
    expect(_parseMgayaPrice("42,8")).toBe(42_800_000);
  });

  it("still treats real thousands-grouped numbers (3-digit groups after a comma) as full amounts", () => {
    expect(_parseMgayaPrice("1,579,999")).toBe(1_579_999);
    expect(_parseMgayaPrice("38,000,000")).toBe(38_000_000);
  });

  it("returns 0 (caller falls back to 'Contact for price') when no price can be found", () => {
    expect(_parseMgayaPrice(null)).toBe(0);
    expect(_parseMgayaPrice("")).toBe(0);
  });
});
