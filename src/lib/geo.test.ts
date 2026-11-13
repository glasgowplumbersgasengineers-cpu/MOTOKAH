import { describe, expect, it, vi } from "vitest";

vi.mock("@capacitor/geolocation", () => ({ Geolocation: {} }));

import { nearestCity } from "./geo";

describe("nearestCity", () => {
  it("resolves Nairobi to Kenya, not Tanzania", () => {
    expect(nearestCity(-1.2864, 36.8172)).toEqual({ country: "Kenya", city: "Nairobi" });
  });

  it("maps Nairobi suburbs to the Nairobi hub", () => {
    expect(nearestCity(-1.17, 36.83)).toEqual({ country: "Kenya", city: "Nairobi" });
    expect(nearestCity(-1.15, 36.96)).toEqual({ country: "Kenya", city: "Nairobi" });
  });

  it("finds secondary cities", () => {
    expect(nearestCity(-4.05, 39.66)).toEqual({ country: "Kenya", city: "Mombasa" });
    expect(nearestCity(-3.36, 36.69)).toEqual({ country: "Tanzania", city: "Arusha" });
    expect(nearestCity(-6.8, 39.28)).toEqual({ country: "Tanzania", city: "Dar es Salaam" });
    expect(nearestCity(-1.94, 30.06)).toEqual({ country: "Rwanda", city: "Kigali" });
    expect(nearestCity(0.31, 32.58)).toEqual({ country: "Uganda", city: "Kampala" });
  });

  it("returns null far from any supported city", () => {
    expect(nearestCity(51.5, -0.12)).toBeNull();
  });
});
