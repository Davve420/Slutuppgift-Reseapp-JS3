export interface Country {
  alpha3Code: string;
  name: string;
  capital?: string;
  region: string;
  population: number;
  flag: string;
}

export interface CountryDetails extends Country {
  alpha2Code?: string;
  coordinates?: [number, number];
  nativeName?: string;
  subregion?: string;
  area?: number;
  languages: string[];
  currencies: string[];
}
