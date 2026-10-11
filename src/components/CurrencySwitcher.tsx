import { CURRENCIES, type CurrencyCode, useCurrency } from "@/contexts/CurrencyContext";

export default function CurrencySwitcher({ mobile = false }: { mobile?: boolean }) {
  const { currency, setCurrency, followsLocation } = useCurrency();
  return (
    <label className={mobile ? "flex items-center justify-between gap-3 px-3 py-2 text-sm" : "flex items-center"}>
      {mobile && <span className="text-muted-foreground">Currency</span>}
      <select aria-label="Display currency" value={followsLocation ? "auto" : currency ?? "auto"}
        onChange={(event) => setCurrency(event.target.value === "auto" ? null : event.target.value as CurrencyCode)}
        className={`${mobile ? "h-10 min-w-32" : "h-8 w-[76px]"} rounded-md border border-input bg-background px-2 text-xs font-semibold text-foreground`}>
        <option value="auto">Auto</option>
        {CURRENCIES.map((code) => <option key={code} value={code}>{code}</option>)}
      </select>
    </label>
  );
}
