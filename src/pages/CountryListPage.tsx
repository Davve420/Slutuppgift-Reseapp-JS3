import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { COUNTRY_CACHE_TIME, getCountries } from "../api/countries";

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"] as const;
const PAGE_SIZE = 6;

type RegionFilter = (typeof REGIONS)[number];

function isRegionFilter(value: string | null): value is RegionFilter {
  return REGIONS.some((region) => region === value);
}

export default function CountryListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const countriesQuery = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: COUNTRY_CACHE_TIME,
  });
  const countries = countriesQuery.data ?? [];
  const query = searchParams.get("query") ?? "";
  const requestedRegion = searchParams.get("region");
  const region: RegionFilter = isRegionFilter(requestedRegion)
    ? requestedRegion
    : "All";
  const filteredCountries = countries.filter((country) => {
    const matchesName = country.name.toLocaleLowerCase("sv").includes(query.toLocaleLowerCase("sv"));
    const matchesRegion = region === "All" || country.region === region;
    return matchesName && matchesRegion;
  });
  const totalPages = Math.max(1, Math.ceil(filteredCountries.length / PAGE_SIZE));
  const parsedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(parsedPage) ? Math.min(Math.max(parsedPage, 1), totalPages) : 1;
  const firstVisibleCountry = (page - 1) * PAGE_SIZE;
  const visibleCountries = filteredCountries.slice(
    firstVisibleCountry,
    firstVisibleCountry + PAGE_SIZE,
  );

  useEffect(() => {
    if (countriesQuery.isPending || countriesQuery.isError) {
      return;
    }

    const rawPage = searchParams.get("page");
    if (rawPage !== null && rawPage !== String(page)) {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (page === 1) {
            next.delete("page");
          } else {
            next.set("page", String(page));
          }
          return next;
        },
        { replace: true },
      );
    }
  }, [
    countriesQuery.isError,
    countriesQuery.isPending,
    page,
    searchParams,
    setSearchParams,
  ]);

  function updateListState(key: "query" | "region" | "page", value: string) {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key === "query" || key === "region") {
        next.delete("page");
      }
      return next;
    }, { replace: key === "query" });
  }

  return (
    <main className="page-shell pb-12 pt-7 sm:pb-16 sm:pt-10">
      <section className="hero-panel" aria-labelledby="page-title">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow text-mint">DIN NÄSTA HISTORIA BÖRJAR HÄR</p>
          <h1
            className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
            id="page-title"
          >
            Världen väntar.
            <span className="block text-mint">Var börjar vi?</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg">
            Hitta en ny favorit bland världens länder och börja drömma om nästa resa.
          </p>
        </div>
        <div className="hero-stamp" aria-hidden="true">
          <Sparkles size={25} strokeWidth={1.6} />
          <span className="mt-2 text-xs font-semibold uppercase tracking-[0.14em]">
            ut & upptäck
          </span>
        </div>
        <div className="hero-route" aria-hidden="true">
          <div className="hero-route-heading">
            <span>RESENOTERING</span>
            <span>NR. 001</span>
          </div>
          <svg
            className="hero-route-map"
            viewBox="0 0 260 130"
            fill="none"
            role="presentation"
          >
            <path
              className="hero-route-path"
              d="M30 92C63 28 102 121 132 67S194 22 230 51"
              stroke="currentColor"
              strokeDasharray="4 7"
              strokeLinecap="round"
              strokeWidth="2"
            />
            <circle cx="30" cy="92" r="6" fill="currentColor" />
            <circle
              cx="230"
              cy="51"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <Plane className="hero-route-plane" size={25} strokeWidth={1.8} />
          <div className="hero-route-footer">
            <span>INGEN RESA ÄR DEN ANDRA LIK</span>
            <span>✳</span>
          </div>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="countries-heading">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">LITEN PLANET, STORA MÖJLIGHETER</p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-ink"
              id="countries-heading"
            >
              Välj en plats
            </h2>
          </div>
          <p className="text-sm text-ink/60" aria-live="polite">
            {countriesQuery.isSuccess
              ? `${filteredCountries.length} ${
                  filteredCountries.length === 1 ? "land" : "länder"
                } i visningen`
              : countriesQuery.isPending
                ? "Hämtar länder..."
                : "Länderna kunde inte hämtas"}
          </p>
        </div>

        <div className="mt-6 grid gap-5 rounded-3xl border border-ink/10 bg-white p-4 shadow-card sm:p-6">
          <div className="relative max-w-xl">
            <label className="sr-only" htmlFor="country-search">
              Sök på landsnamn
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/45"
              size={19}
              aria-hidden="true"
            />
            <input
              autoComplete="off"
              className="search-input"
              id="country-search"
              onChange={(event) => updateListState("query", event.target.value)}
              placeholder="Sök efter ett land..."
              type="search"
              value={query}
            />
          </div>

          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 text-sm font-semibold text-ink">
              Filtrera efter region
            </legend>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((item) => (
                <button
                  aria-pressed={region === item}
                  className={`region-chip ${region === item ? "region-chip-active" : ""}`}
                  key={item}
                  onClick={() => updateListState("region", item === "All" ? "" : item)}
                  type="button"
                >
                  {item === "All" ? "Alla regioner" : item}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        {countriesQuery.isPending ? (
          <p className="mt-6 rounded-3xl bg-white px-6 py-12 text-center text-ink/70" role="status">
            Hämtar världens länder...
          </p>
        ) : countriesQuery.isError ? (
          <div className="mt-6 rounded-3xl border border-coral/40 bg-white px-6 py-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              Kunde inte hämta länderna
            </p>
            <p className="mt-2 text-sm text-ink/60">
              {countriesQuery.error instanceof Error
                ? countriesQuery.error.message
                : "Ett oväntat fel inträffade."}
            </p>
            <button
              className="button-primary mt-5"
              onClick={() => void countriesQuery.refetch()}
              type="button"
            >
              Försök igen
            </button>
          </div>
        ) : visibleCountries.length > 0 ? (
          <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCountries.map((country) => (
              <li key={country.alpha3Code}>
                <Link
                  className="country-card group"
                  to={`/country/${country.alpha3Code}?${searchParams.toString()}`}
                >
                  <span
                    className="country-flag"
                    role="img"
                    aria-label={`${country.name} – flagga`}
                  >
                    {country.flag}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-xl font-bold text-ink">
                      {country.name}
                    </span>
                    <span className="mt-1 block text-sm text-ink/60">{country.region}</span>
                    <span className="mt-4 flex items-center gap-1.5 text-sm font-medium text-ink/75">
                      <MapPin size={15} aria-hidden="true" />
                      {country.capital ?? "Huvudstad saknas"}
                    </span>
                  </span>
                  <span
                    className="card-arrow"
                    aria-hidden="true"
                  >
                    <ArrowRight size={17} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-ink/20 bg-white px-6 py-12 text-center">
            <p className="font-display text-xl font-semibold text-ink">
              Inga länder matchar dina kriterier
            </p>
            <p className="mt-2 text-sm text-ink/60">
              Prova ett annat sökord eller välj en annan region.
            </p>
          </div>
        )}

        {!countriesQuery.isPending &&
          !countriesQuery.isError &&
          filteredCountries.length > 0 && (
          <nav
            className="mt-7 flex items-center justify-center gap-4"
            aria-label="Paginering"
          >
            <button
              className="pagination-button"
              disabled={page === 1}
              onClick={() => updateListState("page", String(page - 1))}
              type="button"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              <span className="hidden sm:inline">Föregående</span>
            </button>
            <p className="min-w-24 text-center text-sm font-semibold text-ink">
              Sida {page} av {totalPages}
            </p>
            <button
              className="pagination-button"
              disabled={page === totalPages}
              onClick={() => updateListState("page", String(page + 1))}
              type="button"
            >
              <span className="hidden sm:inline">Nästa</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </nav>
        )}
      </section>
      <p className="mt-8 text-center text-xs text-ink/50">
        Landdata hämtas från countries.dev och filtreras här i appen.
      </p>
    </main>
  );
}
