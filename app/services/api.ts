const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

import {
  Dog,
  SearchResponse,
  Match,
  Location,
  LocationSearchParams,
  DogSearchParams,
} from "../types/types";

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  // Some endpoints might not return JSON
  if (response.headers.get("content-type")?.includes("application/json")) {
    return response.json();
  }

  return response;
}

export const api = {
  login: async (name: string, email: string) => {
    return fetchWithAuth("/auth/login", {
      method: "POST",
      body: JSON.stringify({ name, email }),
    });
  },

  logout: async () => {
    return fetchWithAuth("/auth/logout", {
      method: "POST",
    });
  },

  getBreeds: async (): Promise<string[]> => {
    return fetchWithAuth("/dogs/breeds");
  },

  searchDogs: async (params: DogSearchParams): Promise<SearchResponse> => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    return fetchWithAuth(`/dogs/search?${searchParams.toString()}`);
  },

  getDogs: async (dogIds: string[]): Promise<Dog[]> => {
    return fetchWithAuth("/dogs", {
      method: "POST",
      body: JSON.stringify(dogIds),
    });
  },

  getMatch: async (dogIds: string[]): Promise<Match> => {
    return fetchWithAuth("/dogs/match", {
      method: "POST",
      body: JSON.stringify(dogIds),
    });
  },

  searchLocations: async (params: LocationSearchParams) => {
    return fetchWithAuth("/locations/search", {
      method: "POST",
      body: JSON.stringify(params),
    });
  },

  getLocations: async (zipCodes: string[]): Promise<Location[]> => {
    return fetchWithAuth("/locations", {
      method: "POST",
      body: JSON.stringify(zipCodes),
    });
  },
};
