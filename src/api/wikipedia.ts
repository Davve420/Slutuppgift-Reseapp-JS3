import type { CountryDetails } from "../types/country";
import { request } from "./request";

export const WIKIPEDIA_CACHE_TIME = 24 * 60 * 60 * 1000;

export class WikipediaArticleNotFoundError extends Error {
  constructor() {
    super("Hittade ingen introduktion på Wikipedia.");
    this.name = "WikipediaArticleNotFoundError";
  }
}

export interface WikipediaSummary {
  title: string;
  extract: string;
  imageUrl?: string;
  articleUrl: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function getWikipediaSummary(
  country: CountryDetails,
): Promise<WikipediaSummary> {
  const articleName = country.nativeName || country.name;
  const response = await request(
    `https://sv.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleName)}`,
    "Wikipedia",
  );

  if (response.status === 404) {
    throw new WikipediaArticleNotFoundError();
  }
  if (!response.ok) {
    throw new Error("Kunde inte hämta introduktionen från Wikipedia.");
  }

  const data: unknown = await response.json();
  if (
    !isRecord(data) ||
    typeof data.title !== "string" ||
    typeof data.extract !== "string" ||
    !isRecord(data.content_urls) ||
    !isRecord(data.content_urls.desktop) ||
    typeof data.content_urls.desktop.page !== "string"
  ) {
    throw new WikipediaArticleNotFoundError();
  }

  return {
    title: data.title,
    extract: data.extract,
    imageUrl:
      isRecord(data.thumbnail) && typeof data.thumbnail.source === "string"
        ? data.thumbnail.source
        : undefined,
    articleUrl: data.content_urls.desktop.page,
  };
}
