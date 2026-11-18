import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageTitle } from "@/hooks/usePageTitle";
import { trackEvent } from "@/lib/analytics";
import { DUTY_COUNTRIES, DUTY_COUNTRY_SLUGS, type DutyCountry } from "@/data/dutyRates";
import {
  IconCalculator, IconSearch, IconCar, IconAlertCircle,
  IconCheck, IconExternalLink, IconCurrencyDollar,
} from "@/components/icons";

interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  bodyType: string;
  engineCC: number;
  fuelType: string;
  trim: string;
}

interface DutyResult {
  cif: number;
  rows: { label: string; note: string; amount: number }[];
  total: number;
}

function calcDuties(country: DutyCountry, cifUSD: number, engineCC: number): DutyResult {
  const rows: { label: string; note: string; amount: number }[] = [];
  let dutySoFar = 0;
  for (const levy of country.levies) {
    const amount = levy.compute(cifUSD, engineCC, dutySoFar);
    rows.push({ label: levy.label, note: levy.note, amount });
    dutySoFar += amount;
  }
  return { cif: cifUSD, rows, total: dutySoFar };
}

function fmt(n: number, currency: "USD" | "LOCAL", usdRate: number, localCode: string): string {
  return currency === "USD"
    ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : `${localCode} ${(n * usdRate).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function DutyCalculator() {
  const { country: countrySlugParam } = useParams<{ country?: string }>();
  const navigate = useNavigate();
  const countrySlug = countrySlugParam && DUTY_COUNTRIES[countrySlugParam] ? countrySlugParam : "tanzania";
  const country = DUTY_COUNTRIES[countrySlug];

  usePageTitle(
    countrySlug === "tanzania"
      ? "TRA Vehicle Duty Calculator Tanzania | Car Import Tax — Motokah"
      : `${country.authorityName} Vehicle Duty Calculator ${country.name} | Car Import Tax — Motokah`,
  );

  const [vin, setVin] = useState("");
  const [cif, setCif] = useState("");
  const [vehicle, setVehicle] = useState<VehicleInfo | null>(null);
  const browseParams = new URLSearchParams({ country: country.name });
  if (vehicle?.make) browseParams.set("make", vehicle.make);
  if (vehicle?.model) browseParams.set("model", vehicle.model);
  const [decoding, setDecoding] = useState(false);
  const [decodeError, setDecodeError] = useState("");
  const [result, setResult] = useState<DutyResult | null>(null);
  const [currency, setCurrency] = useState<"USD" | "LOCAL">("USD");

  const decodeVin = async () => {
    const v = vin.trim().toUpperCase();
    if (v.length !== 17) { setDecodeError("VIN must be exactly 17 characters."); return; }
    setDecoding(true);
    setDecodeError("");
    setVehicle(null);
    setResult(null);
    try {
      const res = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${v}?format=json`
      );
      const json = await res.json();
      const get = (var_: string) =>
        json.Results?.find((r: { Variable: string; Value: string }) => r.Variable === var_)?.Value || "";

      const make = get("Make");
      const model = get("Model");
      const year = get("Model Year");
      const bodyType = get("Body Class");
      const fuelType = get("Fuel Type - Primary");
      const trim = get("Trim");
      const displacementStr = get("Displacement (CC)");
      const engineCC = displacementStr ? parseFloat(displacementStr) : 1500;

      if (!make || make === "Not Applicable") {
        setDecodeError("VIN not found. Check the number and try again.");
        setDecoding(false);
        return;
      }

      setVehicle({ make, model, year, bodyType, fuelType, trim, engineCC });
    } catch {
      setDecodeError("Could not reach decode service. Check your connection.");
    } finally {
      setDecoding(false);
    }
  };

  const calculate = () => {
    const cifVal = parseFloat(cif.replace(/,/g, ""));
    if (!cifVal || cifVal <= 0) return;
    const cc = vehicle?.engineCC || 1500;
    setResult(calcDuties(country, cifVal, cc));
  };

  const switchCountry = (slug: string) => {
    setResult(null);
    navigate(slug === "tanzania" ? "/duty-calculator" : `/${slug}/duty-calculator`);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <IconCalculator size={22} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">{country.name} Import Duty Calculator</h1>
              <p className="text-sm text-muted-foreground">Estimate {country.authorityName} duties before shipping your vehicle</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {DUTY_COUNTRY_SLUGS.map((slug) => (
              <button
                key={slug}
                onClick={() => switchCountry(slug)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  slug === countrySlug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:border-primary"
                }`}
              >
                {DUTY_COUNTRIES[slug].name}
              </button>
            ))}
          </div>
        </div>

        {/* Step 1 — VIN */}
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <h2 className="font-bold text-foreground mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
            Decode Your VIN
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Find the 17-character VIN on the dashboard or door jamb of the vehicle.</p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. JT3HN87R3X0123456"
              value={vin}
              onChange={e => setVin(e.target.value.toUpperCase())}
              maxLength={17}
              className="font-mono tracking-wider uppercase"
            />
            <Button onClick={decodeVin} disabled={decoding || vin.trim().length < 17} className="shrink-0 gap-1.5">
              <IconSearch size={15} />
              {decoding ? "Decoding…" : "Decode"}
            </Button>
          </div>
          {decodeError && (
            <p className="flex items-center gap-1.5 text-destructive text-xs mt-2">
              <IconAlertCircle size={13} /> {decodeError}
            </p>
          )}

          {vehicle && (
            <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/30 flex items-start gap-3">
              <IconCheck size={18} className="text-success mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-bold text-foreground">{vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ""}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                  {vehicle.bodyType && <span>Body: {vehicle.bodyType}</span>}
                  {vehicle.engineCC > 0 && <span>Engine: {vehicle.engineCC.toFixed(0)} cc</span>}
                  {vehicle.fuelType && <span>Fuel: {vehicle.fuelType}</span>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — CIF */}
        <div className="bg-card border border-border rounded-xl p-5 mb-4">
          <h2 className="font-bold text-foreground mb-1 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
            Enter CIF Value (USD)
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            CIF = Cost of vehicle + Insurance + Freight to {country.cifHint}. This is the value {country.authorityName} uses to calculate duties.
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconCurrencyDollar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="number"
                placeholder="e.g. 8500"
                value={cif}
                onChange={e => setCif(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={calculate} disabled={!cif || parseFloat(cif) <= 0} className="shrink-0">
              Calculate
            </Button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-xl overflow-hidden mb-4">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">Duty Breakdown</h2>
              <div className="flex gap-1 text-xs">
                {(["USD", "LOCAL"] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {c === "USD" ? "USD" : country.currency}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border">
              <div className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">CIF Value</p>
                  <p className="text-xs text-muted-foreground">Your cost + insurance + freight to {country.cifHint}</p>
                </div>
                <p className="text-sm font-semibold text-foreground tabular-nums">{fmt(result.cif, currency, country.usdRate, country.currency)}</p>
              </div>
              {result.rows.map(({ label, note, amount }) => (
                <div key={label} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{note}</p>
                  </div>
                  <p className="text-sm font-semibold text-foreground tabular-nums">{fmt(amount, currency, country.usdRate, country.currency)}</p>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 bg-primary/5 border-t border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Total Payable to {country.authorityName}</p>
                <p className="text-2xl font-extrabold text-primary">{fmt(result.total, currency, country.usdRate, country.currency)}</p>
                {currency === "USD" && (
                  <p className="text-xs text-muted-foreground">≈ {country.currency} {(result.total * country.usdRate).toLocaleString()}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Effective rate on CIF</p>
                <p className="text-lg font-bold text-foreground">{((result.total / result.cif) * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex gap-2 p-4 rounded-lg bg-accent/10 border border-accent/20 mb-6">
          <IconAlertCircle size={16} className="text-accent shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Estimates only.</span> {country.effectiveNote}
            Actual duties may vary by vehicle age, origin, and current {country.authorityName} rulings.
            Always verify with <a href={country.authorityUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{country.authorityName}</a> or a licensed clearing agent before shipping.
          </p>
        </div>

        {/* Buyer CTA — shown after result */}
        {result && (
          <div className="bg-primary/5 border border-primary/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <IconSearch size={22} className="text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  {vehicle?.make ? `Compare ${vehicle.make}${vehicle.model ? ` ${vehicle.model}` : ""} listings in ${country.name}` : `Browse cars already landed in ${country.name}`}
                </p>
                <p className="text-xs text-muted-foreground">Skip the import, buy direct from local sellers, no duty hassle</p>
              </div>
            </div>
            <Link
              to={`/search?${browseParams}`}
              onClick={() => trackEvent("duty_calculator_browse_click", { make: vehicle?.make || null, model: vehicle?.model || null })}
            >
              <Button className="gap-1.5 shrink-0">
                <IconSearch size={15} /> {vehicle?.make ? "Compare Cars" : "Browse Cars"}
              </Button>
            </Link>
          </div>
        )}

        {/* Seller CTA */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IconCar size={22} className="text-primary shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Ready to list this vehicle?</p>
              <p className="text-xs text-muted-foreground">Post your ad on Motokah and reach buyers searching in {country.name}.</p>
            </div>
          </div>
          <Link to="/sell">
            <Button variant="outline" className="gap-1.5 shrink-0">
              <IconExternalLink size={15} /> Post an Ad
            </Button>
          </Link>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[
            { label: "Import Duty", value: `${country.importDutyRatePct}%`, note: "of CIF value" },
            { label: country.authorityName, value: country.name, note: "customs authority" },
            { label: "Exchange Rate", value: country.usdRate.toLocaleString(), note: `${country.currency} per USD (est.)` },
          ].map(item => (
            <div key={item.label} className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-2xl font-extrabold text-primary">{item.value}</p>
              <p className="text-xs font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.note}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
