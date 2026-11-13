import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import FilterSidebar, { type Filters } from "@/components/FilterSidebar";

interface MobileFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onChange: (filters: Filters) => void;
  onClear: () => void;
}

export default function MobileFilterDrawer({ open, onOpenChange, filters, onChange, onClear }: MobileFilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto safe-bottom">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="py-4 pb-24">
          <FilterSidebar filters={filters} onChange={onChange} onClear={onClear} hideHeader />
        </div>
        <div className="sticky bottom-0 pt-3 bg-background border-t border-border flex gap-3" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
          <button onClick={onClear} className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-muted/50">
            Clear All
          </button>
          <button onClick={() => onOpenChange(false)} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
