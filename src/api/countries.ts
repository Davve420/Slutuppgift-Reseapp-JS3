import type { Country, CountryDetails } from "../types/country";

const COUNTRIES_URL =
  "https://countries.dev/countries?fields=name,alpha3Code,region,capital,flags,population,area,flag";
const COUNTRY_CACHE_TIME = 60 * 60 * 1000;

interface CountriesDevCountryResponse {
  name: string;
  alpha3Code: string;
  region: string;
  capital?: string;
  flags: {
    png: string;
  };
  flag: string;
  population: number;
}

export class CountryNotFoundError extends Error {
  constructor() {
    super("Landet hittades inte.");
    this.name = "CountryNotFoundError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCountriesDevCountry(value: unknown): value is CountriesDevCountryResponse {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.alpha3Code === "string" &&
    typeof value.region === "string" &&
    (value.capital === undefined || typeof value.capital === "string") &&
    isRecord(value.flags) &&
    typeof value.flags.png === "string" &&
    typeof value.flag === "string" &&
    typeof value.population === "number"
  );
}

function toCountry(country: CountriesDevCountryResponse): Country {
  return {
    alpha3Code: country.alpha3Code,
    name: country.name,
    capital: country.capital,
    region: country.region,
    population: country.population,
    flag: country.flag,
  };
}

export async function getCountries(): Promise<Country[]> {
  const response = await fetch(COUNTRIES_URL);

  if (!response.ok) {
    throw new Error("Kunde inte hämta länderna. Försök igen.");
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isCountriesDevCountry)) {
    throw new Error("Landslistan hade ett oväntat format.");
  }

  return data.map(toCountry);
}

export async function getCountryDetails(code: string): Promise<CountryDetails> {
  const response = await fetch(
    `https://countries.dev/alpha/${encodeURIComponent(code)}`,
  );

  if (response.status === 404) {
    throw new CountryNotFoundError();
  }
  if (!response.ok) {
    throw new Error("Kunde inte hämta landets uppgifter. Försök igen.");
  }

  const data: unknown = await response.json();
  if (
    !isRecord(data) ||
    typeof data.name !== "string" ||
    typeof data.alpha3Code !== "string" ||
    typeof data.region !== "string" ||
    typeof data.population !== "number" ||
    !isRecord(data.flags) ||
    typeof data.flags.png !== "string" ||
    typeof data.flag !== "string"
  ) {
    throw new Error("Landets uppgifter hade ett oväntat format.");
  }

  const languages = Array.isArray(data.languages)
    ? data.languages.flatMap((language) =>
        isRecord(language) && typeof language.name === "string"
          ? [language.name]
          : [],
      )
    : [];
  const currencies = Array.isArray(data.currencies)
    ? data.currencies.flatMap((currency) =>
        isRecord(currency) && typeof currency.name === "string"
          ? [currency.name]
          : [],
      )
    : [];

  return {
    ...toCountry({
      name: data.name,
      alpha3Code: data.alpha3Code,
      region: data.region,
      capital: typeof data.capital === "string" ? data.capital : undefined,
      flags: { png: data.flags.png },
      flag: data.flag,
      population: data.population,
    }),
    nativeName: typeof data.nativeName === "string" ? data.nativeName : undefined,
    subregion: typeof data.subregion === "string" ? data.subregion : undefined,
    alpha2Code: typeof data.alpha2Code === "string" ? data.alpha2Code : undefined,
    coordinates:
      Array.isArray(data.latlng) &&
      data.latlng.length >= 2 &&
      typeof data.latlng[0] === "number" &&
      typeof data.latlng[1] === "number"
        ? [data.latlng[0], data.latlng[1]]
        : undefined,
    area: typeof data.area === "number" ? data.area : undefined,
    languages,
    currencies,
  };
}

export { COUNTRY_CACHE_TIME };
