// Real government customs rules per East African country, each sourced
// from that country's own revenue authority, not guessed or averaged. Only
// add a country here once its rates are confirmed from an official source,
// a wrong duty number has real financial consequences for someone shipping
// a car. Uganda, Rwanda, Burundi and South Sudan are deliberately NOT in
// here yet, their rates haven't been verified against URA/RRA/OBR/customs.
export interface LevyRow {
  label: string;
  note: string;
  compute: (cif: number, engineCC: number, dutySoFar: number) => number;
}

export interface DutyCountry {
  slug: string;
  name: string;
  currency: string;
  usdRate: number; // approx local currency per USD, for display conversion only
  authorityName: string;
  authorityUrl: string;
  cifHint: string; // which port/border the CIF value is landed at
  effectiveNote: string;
  importDutyRatePct: number; // for display only, e.g. the info card
  levies: LevyRow[];
}

export const DUTY_COUNTRIES: Record<string, DutyCountry> = {
  tanzania: {
    slug: "tanzania",
    name: "Tanzania",
    currency: "TZS",
    usdRate: 2600,
    authorityName: "TRA",
    authorityUrl: "https://www.tra.go.tz",
    cifHint: "Dar es Salaam port",
    effectiveNote: "Rates based on TRA tariff schedule effective 2026.",
    importDutyRatePct: 25,
    levies: [
      {
        label: "Import Duty (25%)",
        note: "Tanzania Customs tariff on CIF",
        compute: (cif) => cif * 0.25,
      },
      {
        label: "Excise Duty",
        note: "Based on engine displacement (CC)",
        compute: (cif, cc) => {
          const rate = cc <= 1000 ? 0.05 : cc <= 2000 ? 0.10 : cc <= 3000 ? 0.20 : 0.25;
          return cif * rate;
        },
      },
      {
        label: "VAT (18%)",
        note: "On CIF + Import Duty + Excise Duty",
        compute: (cif, _cc, dutySoFar) => (cif + dutySoFar) * 0.18,
      },
      {
        label: "Infrastructure Levy (1.5%)",
        note: "Roads and infrastructure fund",
        compute: (cif) => cif * 0.015,
      },
      {
        label: "Port & Handling (est.)",
        note: "Dar es Salaam port handling estimate",
        compute: () => 800,
      },
    ],
  },
  kenya: {
    slug: "kenya",
    name: "Kenya",
    currency: "KES",
    usdRate: 129,
    authorityName: "KRA",
    authorityUrl: "https://www.kra.go.ke",
    cifHint: "Mombasa port",
    effectiveNote:
      "Rates from KRA's own published import-duty guide, checked 2026-11-18. KRA's own page is inconsistent on the IDF rate (states 3.5% but its worked example applies closer to 4%), confirm the exact IDF with KRA before relying on this for a real shipment.",
    importDutyRatePct: 25,
    levies: [
      {
        label: "Import Duty (25%)",
        note: "KRA Customs tariff on CIF",
        compute: (cif) => cif * 0.25,
      },
      {
        label: "Excise Duty",
        note: "20% up to 1500cc, 25% above 1500cc",
        compute: (cif, cc) => cif * (cc <= 1500 ? 0.20 : 0.25),
      },
      {
        label: "VAT (16%)",
        note: "On CIF + Import Duty + Excise Duty",
        compute: (cif, _cc, dutySoFar) => (cif + dutySoFar) * 0.16,
      },
      {
        label: "Railway Development Levy (2%)",
        note: "On CIF value",
        compute: (cif) => cif * 0.02,
      },
      {
        label: "Import Declaration Fee (~3.5%)",
        note: "On CIF value, KRA's own page is unclear on the exact figure",
        compute: (cif) => cif * 0.035,
      },
    ],
  },
};

export const DUTY_COUNTRY_SLUGS = Object.keys(DUTY_COUNTRIES);
