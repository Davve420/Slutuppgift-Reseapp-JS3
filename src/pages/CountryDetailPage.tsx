import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  COUNTRY_CACHE_TIME,
  CountryNotFoundError,
  getCountryDetails,
} from "../api/countries";
import { getCurrentWeather, WEATHER_CACHE_TIME } from "../api/weather";
import {
  getWikipediaSummary,
  WikipediaArticleNotFoundError,
  WIKIPEDIA_CACHE_TIME,
} from "../api/wikipedia";
import type { CountryDetails } from "../types/country";

function WeatherSection({ country }: { country: CountryDetails }) {
  const weatherQuery = useQuery({
    queryKey: ["weather", country.alpha3Code],
    queryFn: () => getCurrentWeather(country),
    staleTime: WEATHER_CACHE_TIME,
    retry: 1,
  });

  return (
    <section
      className="rounded-3xl border border-ink/10 bg-white p-6 shadow-card sm:p-8"
      aria-labelledby="weather-heading"
    >
      <p className="eyebrow">
        JUST NU I{" "}
        {(country.capital ?? country.nativeName ?? country.name).toLocaleUpperCase(
          "sv",
        )}
      </p>
      <h2 id="weather-heading" className="mt-2 font-display text-2xl font-bold text-ink">
        Väder
      </h2>
      {weatherQuery.isPending ? (
        <p className="mt-4 text-ink/65" role="status">Hämtar aktuellt väder...</p>
      ) : weatherQuery.isError ? (
        <div className="mt-4">
          <p className="text-sm text-ink/70">
            {weatherQuery.error instanceof Error
              ? weatherQuery.error.message
              : "Vädret kunde inte hämtas."}
          </p>
          <button
            className="button-primary mt-4"
            onClick={() => void weatherQuery.refetch()}
            type="button"
          >
            Försök igen
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="text-4xl" aria-hidden="true">
            {weatherQuery.data.icon}
          </span>
          <p className="text-lg font-semibold text-ink">
            {weatherQuery.data.description}, {weatherQuery.data.temperature} °C
          </p>
          <p className="text-sm text-ink/65">
            Vind {weatherQuery.data.windSpeed} km/h
          </p>
        </div>
      )}
      <p className="mt-5 text-xs text-ink/50">
        Väder från{" "}
        <a
          className="underline underline-offset-2"
          href="https://open-meteo.com/"
          rel="noreferrer"
          target="_blank"
        >
          Open-Meteo
        </a>
      </p>
    </section>
  );
}

function WikipediaSection({ country }: { country: CountryDetails }) {
  const [imageUnavailable, setImageUnavailable] = useState(false);
  const articleQuery = useQuery({
    queryKey: ["wikipedia", country.alpha3Code],
    queryFn: () => getWikipediaSummary(country),
    staleTime: WIKIPEDIA_CACHE_TIME,
    retry: (failureCount, error) =>
      !(error instanceof WikipediaArticleNotFoundError) && failureCount < 1,
  });

  return (
    <section
      className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card"
      aria-labelledby="wikipedia-heading"
    >
      <div className="p-6 sm:p-8">
        <p className="eyebrow">LÄR KÄNNA PLATSEN</p>
        <h2
          id="wikipedia-heading"
          className="mt-2 font-display text-2xl font-bold text-ink"
        >
          Om {country.nativeName ?? country.name}
        </h2>
        {articleQuery.isPending ? (
          <p className="mt-4 text-ink/65" role="status">
            Hämtar en introduktion från Wikipedia...
          </p>
        ) : articleQuery.isError ? (
          <div className="mt-4">
            <p className="text-sm text-ink/70">
              {articleQuery.error instanceof Error
                ? articleQuery.error.message
                : "Introduktionen kunde inte hämtas."}
            </p>
            <button
              className="button-primary mt-4"
              onClick={() => void articleQuery.refetch()}
              type="button"
            >
              Försök igen
            </button>
          </div>
        ) : (
          <>
            <p className="mt-4 leading-relaxed text-ink/75">
              {articleQuery.data.extract}
            </p>
            <a
              className="mt-4 inline-flex font-semibold text-forest underline underline-offset-4"
              href={articleQuery.data.articleUrl}
              rel="noreferrer"
              target="_blank"
            >
              Läs mer på Wikipedia: {articleQuery.data.title}
            </a>
          </>
        )}
      </div>
      {articleQuery.isSuccess && articleQuery.data.imageUrl && !imageUnavailable ? (
        <figure className="border-t border-ink/10">
          <img
            className="max-h-80 w-full object-cover"
            src={articleQuery.data.imageUrl}
            alt={`Bild från Wikipedia som illustrerar ${country.name}`}
            loading="lazy"
            onError={() => setImageUnavailable(true)}
          />
          <figcaption className="px-6 py-3 text-xs text-ink/55 sm:px-8">
            Bild och text:{" "}
            <a
              className="underline underline-offset-2"
              href={articleQuery.data.articleUrl}
              rel="noreferrer"
              target="_blank"
            >
              Wikipedia
            </a>
          </figcaption>
        </figure>
      ) : null}
    </section>
  );
}

function CountryDetailMessage({
  title,
  message,
  backToList,
  onRetry,
}: {
  title: string;
  message: string;
  backToList: string;
  onRetry?: () => void;
}) {
  return (
    <main className="page-shell py-16">
      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-card">
        <p className="eyebrow">{title}</p>
        <p className="mt-3 text-ink/70">{message}</p>
        <div className="mt-7 flex flex-col items-center gap-4">
          {onRetry ? (
            <button className="button-primary" onClick={onRetry} type="button">
              Försök igen
            </button>
          ) : null}
          <Link className="back-link" to={backToList}>
            <ArrowLeft size={17} aria-hidden="true" />
            Tillbaka till listan
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function CountryDetailPage() {
  const { code } = useParams();
  const location = useLocation();
  const backToList = `/${location.search}`;
  const countryQuery = useQuery({
    queryKey: ["country", code],
    queryFn: () => {
      if (!code) {
        throw new Error("Landets landskod saknas.");
      }
      return getCountryDetails(code);
    },
    enabled: Boolean(code),
    staleTime: COUNTRY_CACHE_TIME,
    retry: (failureCount, error) =>
      !(error instanceof CountryNotFoundError) && failureCount < 1,
  });

  if (countryQuery.isPending) {
    return (
      <main className="page-shell py-16" aria-live="polite" role="status">
        <p className="text-center text-ink/70">Hämtar landets uppgifter...</p>
      </main>
    );
  }

  if (countryQuery.isError) {
    const isMissingCountry = countryQuery.error instanceof CountryNotFoundError;
    return (
      <CountryDetailMessage
        title={isMissingCountry ? "Landet saknas" : "Kunde inte hämta landet"}
        message={
          countryQuery.error instanceof Error
            ? countryQuery.error.message
            : "Ett oväntat fel inträffade."
        }
        backToList={backToList}
        onRetry={
          isMissingCountry ? undefined : () => void countryQuery.refetch()
        }
      />
    );
  }

  const country = countryQuery.data;

  return (
    <main className="page-shell py-8 sm:py-12">
      <Link className="back-link" to={backToList}>
        <ArrowLeft size={17} aria-hidden="true" />
        Tillbaka till listan
      </Link>
      <article className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-card">
        <div className="bg-forest px-6 py-10 text-white sm:px-10 sm:py-14">
          <span
            className="text-6xl"
            role="img"
            aria-label={`${country.name} – flagga`}
          >
            {country.flag}
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/65">
            {[country.region, country.subregion, country.capital]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {country.name}
          </h1>
          {country.nativeName ? (
            <p className="mt-2 text-white/75">På landets språk: {country.nativeName}</p>
          ) : null}
        </div>
        <dl className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 sm:p-8">
            <dt className="eyebrow">Huvudstad</dt>
            <dd className="mt-2 text-lg font-semibold text-ink">
              {country.capital ?? "Uppgift saknas"}
            </dd>
          </div>
          <div className="bg-white p-6 sm:p-8">
            <dt className="eyebrow">Befolkning</dt>
            <dd className="mt-2 text-lg font-semibold text-ink">
              {country.population.toLocaleString("sv-SE")}
            </dd>
          </div>
          <div className="bg-white p-6 sm:p-8">
            <dt className="eyebrow">Språk</dt>
            <dd className="mt-2 text-lg font-semibold text-ink">
              {country.languages.join(", ") || "Uppgift saknas"}
            </dd>
          </div>
          <div className="bg-white p-6 sm:p-8">
            <dt className="eyebrow">Valuta</dt>
            <dd className="mt-2 text-lg font-semibold text-ink">
              {country.currencies.join(", ") || "Uppgift saknas"}
            </dd>
          </div>
          <div className="bg-white p-6 sm:p-8">
            <dt className="eyebrow">Yta</dt>
            <dd className="mt-2 text-lg font-semibold text-ink">
              {country.area !== undefined
                ? `${country.area.toLocaleString("sv-SE")} km²`
                : "Uppgift saknas"}
            </dd>
          </div>
        </dl>
      </article>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <WeatherSection
          country={country}
          key={`weather-${country.alpha3Code}`}
        />
        <WikipediaSection
          country={country}
          key={`wikipedia-${country.alpha3Code}`}
        />
      </div>
    </main>
  );
}
