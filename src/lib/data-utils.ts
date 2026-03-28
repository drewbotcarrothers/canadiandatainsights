import fs from "fs";
import path from "path";
import Papa from "papaparse";

export interface LocationData {
  ALT_GEO_CODE: string | number;
  GEO_NAME: string;
  GEO_LEVEL: string;
  POP_2021: number;
  POP_2016: number;
  POP_CHANGE_PCT: number;
  POP_CHANGE_ABS: number;
  HH_INCOME_MEDIAN_AFTER_TAX: number;
  HH_INCOME_AVG_AFTER_TAX: number;
  POP_AVG_AGE: number;
  RANK_POPULATION: number;
  RANK_POP_GROWTH: number;
  RANK_AVG_AGE: number;
  RANK_HH_INCOME: number;
  RANK_TOTAL_IN_GEO_LEVEL: number;
  // Dwelling/Labour/Family props
  HH_AVG_SIZE: number;
  POP_MALE_TO_FEMALE_RATIO: number;
  LABOUR_EMPLOYMENT_RATE: number;
  LABOUR_UNEMPLOYMENT_RATE: number;
  [key: string]: any;
}

const DATA_PATH = path.join(process.cwd(), "Data", "locations.csv");

export async function getAllLocations(): Promise<LocationData[]> {
  const fileContent = fs.readFileSync(DATA_PATH, "utf8");
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = (results.data as LocationData[]).filter(loc => loc.GEO_NAME);
        resolve(data);
      },
      error: (error: any) => {
        reject(error);
      },
    });
  });
}

export async function getLocationBySlug(slug: string): Promise<LocationData | undefined> {
  const locations = await getAllLocations();
  return locations.find((loc) => generateSlug(loc.GEO_NAME) === slug);
}

export function generateSlug(name: string): string {
  if (!name) return "unknown";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getProvinces(): Promise<LocationData[]> {
  const locations = await getAllLocations();
  return locations.filter((loc) => loc.GEO_LEVEL === "Province" || loc.GEO_LEVEL === "Territory");
}

export async function getTopCities(limit = 10): Promise<LocationData[]> {
  const locations = await getAllLocations();
  return locations
    .filter((loc) => loc.GEO_LEVEL === "Census subdivision") // Assuming CSD is "City"
    .sort((a, b) => (b.POP_2021 || 0) - (a.POP_2021 || 0))
    .slice(0, limit);
}

export async function getSearchIndex() {
  const locations = await getAllLocations();
  return locations.map((loc) => ({
    name: loc.GEO_NAME,
    level: loc.GEO_LEVEL,
    slug: generateSlug(loc.GEO_NAME),
  }));
}
