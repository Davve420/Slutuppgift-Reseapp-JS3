import type { CountryDetails } from "../types/country";
import { request } from "./request";

export const WEATHER_CACHE_TIME = 15 * 60 * 1000;

interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface CurrentWeather {
  temperature: number;
  windSpeed: number;
  description: string;
  icon: string;
}

const WEATHER_DESCRIPTIONS: Record<number, { description: string; icon: string }> = {
  0: { description: "Klart", icon: "☀️" },
  1: { description: "Mestadels klart", icon: "🌤️" },
  2: { description: "Delvis molnigt", icon: "⛅" },
  3: { description: "Mulet", icon: "☁️" },
  45: { description: "Dimma", icon: "🌫️" },
  48: { description: "Dimma med rimfrost", icon: "🌫️" },
  51: { description: "Lätt duggregn", icon: "🌦️" },
  53: { description: "Duggregn", icon: "🌦️" },
  55: { description: "Kraftigt duggregn", icon: "🌧️" },
  56: { description: "Lätt underkylt duggregn", icon: "🌧️" },
  57: { description: "Kraftigt underkylt duggregn", icon: "🌧️" },
  61: { description: "Lätt regn", icon: "🌧️" },
  63: { description: "Regn", icon: "🌧️" },
  65: { description: "Kraftigt regn", icon: "🌧️" },
  66: { description: "Lätt underkylt regn", icon: "🌧️" },
  67: { description: "Kraftigt underkylt regn", icon: "🌧️" },
  71: { description: "Lätt snöfall", icon: "🌨️" },
  73: { description: "Snöfall", icon: "🌨️" },
  75: { description: "Kraftigt snöfall", icon: "❄️" },
  77: { description: "Snökorn", icon: "❄️" },
  80: { description: "Lätta regnskurar", icon: "🌦️" },
  81: { description: "Regnskurar", icon: "🌧️" },
  82: { description: "Kraftiga regnskurar", icon: "🌧️" },
  85: { description: "Lätta snöbyar", icon: "🌨️" },
  86: { description: "Kraftiga snöbyar", icon: "❄️" },
  95: { description: "Åska", icon: "⛈️" },
  96: { description: "Åska med lätt hagel", icon: "⛈️" },
  99: { description: "Åska med kraftigt hagel", icon: "⛈️" },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCoordinates(value: unknown): value is Coordinates {
  return (
    isRecord(value) &&
    typeof value.latitude === "number" &&
    typeof value.longitude === "number"
  );
}

async function getCapitalCoordinates(country: CountryDetails): Promise<Coordinates> {
  if (country.capital && country.alpha2Code) {
    const search = new URLSearchParams({
      name: country.capital,
      countryCode: country.alpha2Code,
      count: "1",
      language: "sv",
    });
    const response = await request(
      `https://geocoding-api.open-meteo.com/v1/search?${search.toString()}`,
      "Open-Meteos ortssökning",
    );

    if (!response.ok) {
      throw new Error("Kunde inte hitta huvudstadens koordinater.");
    }

    const data: unknown = await response.json();
    if (!isRecord(data)) {
      throw new Error("Ortssökningen gav ett oväntat svar.");
    }

    if (Array.isArray(data.results) && isCoordinates(data.results[0])) {
      return data.results[0];
    }
  }

  if (country.coordinates) {
    const [latitude, longitude] = country.coordinates;
    return { latitude, longitude };
  }

  throw new Error("Det finns inga koordinater för landets väder.");
}

export async function getCurrentWeather(
  country: CountryDetails,
): Promise<CurrentWeather> {
  const coordinates = await getCapitalCoordinates(country);
  const search = new URLSearchParams({
    latitude: String(coordinates.latitude),
    longitude: String(coordinates.longitude),
    current: "temperature_2m,wind_speed_10m,weather_code",
    timezone: "auto",
  });
  const response = await request(
    `https://api.open-meteo.com/v1/forecast?${search.toString()}`,
    "Open-Meteo",
  );

  if (!response.ok) {
    throw new Error("Kunde inte hämta aktuellt väder.");
  }

  const data: unknown = await response.json();
  if (
    !isRecord(data) ||
    !isRecord(data.current) ||
    typeof data.current.temperature_2m !== "number" ||
    typeof data.current.wind_speed_10m !== "number" ||
    typeof data.current.weather_code !== "number"
  ) {
    throw new Error("Vädertjänsten gav ett oväntat svar.");
  }

  const weather = WEATHER_DESCRIPTIONS[data.current.weather_code] ?? {
    description: "Väderbeskrivning saknas",
    icon: "🌡️",
  };

  return {
    temperature: data.current.temperature_2m,
    windSpeed: data.current.wind_speed_10m,
    description: weather.description,
    icon: weather.icon,
  };
}
