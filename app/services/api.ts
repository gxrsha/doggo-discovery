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
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      window.location.href = "/login";
      throw new Error("Authentication failed");
    }

    let errorMessage = `API call failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // If parsing json fails, use default message
    }
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (response.status === 204 || !contentType) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response;
}

export const api = {
  login: async (name: string, email: string) => {
    try {
      return await fetchWithAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
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
