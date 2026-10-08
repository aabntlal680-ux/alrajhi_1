import { useEffect, useMemo, useRef, useState } from "react";
import { WORLD_COUNTRIES, type CountryOption } from "../data/countries";

type Props = {
  value: string;
  onChange: (country: CountryOption) => void;
  id?: string;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .toLocaleLowerCase("ar")
    .trim();
}

export default function CountrySelect({ value, onChange, id = "country-picker" }: Props) {
  const selected = WORLD_COUNTRIES.find((country) => country.code === value);
  const [query, setQuery] = useState(selected?.name ?? "");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selected?.name ?? "");
  }, [selected?.code, selected?.name]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(query);
    if (!term) return WORLD_COUNTRIES;
    return WORLD_COUNTRIES.filter((country) =>
      normalize(`${country.name} ${country.code}`).includes(term)
    );
  }, [query]);

  const choose = (country: CountryOption) => {
    onChange(country);
    setQuery(country.name);
    setOpen(false);
  };

  return (
    <div className="relative" ref={rootRef}>
      <input
        id={id}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`${id}-options`}
        autoComplete="off"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && open && filtered[0]) {
            event.preventDefault();
            choose(filtered[0]);
          }
        }}
        placeholder="ابحث عن دولة..."
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-200"
      />
      {open && (
        <div
          id={`${id}-options`}
          role="listbox"
          aria-label="الدول المتاحة"
          className="absolute top-full right-0 z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-xl"
        >
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-slate-500">لا توجد دولة مطابقة</div>
          ) : (
            filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                role="option"
                aria-selected={country.code === value}
                onClick={() => choose(country)}
                className={`flex w-full items-center justify-between px-3 py-2 text-right hover:bg-blue-50 ${
                  country.code === value ? "bg-blue-50 font-bold text-[#0a2c72]" : ""
                }`}
              >
                <span>{country.name}</span>
                <span dir="ltr" className="text-xs text-slate-400">
                  {country.code}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
