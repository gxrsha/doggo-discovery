const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

import {
  Dog,
  SearchResponse,
  Match,
  Location,
  LocationSearchParams,
  DogSearchParams,
} from "../types/types";

type LogMessage =
  | string
  | number
  | boolean
  | object
  | null
  | undefined
  | unknown;

const log = {
  debug: (...args: LogMessage[]) => {
    const timestamp = new Date().toISOString();
    const message = `${timestamp} - ${args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
      .join(" ")}`;

    const logs = JSON.parse(localStorage.getItem("api_logs") || "[]");
    logs.push(message);
    localStorage.setItem("api_logs", JSON.stringify(logs.slice(-100)));

    console.debug(message);
  },
  error: (...args: LogMessage[]) => {
    const timestamp = new Date().toISOString();
    const message = `${timestamp} - ERROR - ${args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
      .join(" ")}`;

    const logs = JSON.parse(localStorage.getItem("api_logs") || "[]");
    logs.push(message);
    localStorage.setItem("api_logs", JSON.stringify(logs.slice(-100)));

    console.error(message);
  },
};

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  log.debug("\n=== API Request ===");
  log.debug("Endpoint:", endpoint);
  log.debug("Options:", {
    ...options,
    body: options.body ? JSON.parse(options.body as string) : undefined,
  });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include", // Let browser handle cookies
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      log.error("Response error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      if (response.status === 401) {
        window.location.href = "/login";
        throw new Error("Authentication failed");
      }
      throw new Error(`API call failed: ${response.statusText} - ${errorText}`);
    }

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json")
      ? await response.json()
      : response;
  } catch (error) {
    log.error("Request failed:", {
      error,
      endpoint,
      options,
    });
    throw error;
  }
}

export const api = {
  login: async (name: string, email: string) => {
    log.debug("\n=== Login Attempt ===");
    log.debug("Credentials:", { name, email });
    log.debug("Browser info:", {
      userAgent: window.navigator.userAgent,
      cookieEnabled: window.navigator.cookieEnabled,
    });

    try {
      const response = await fetchWithAuth("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });

      if (!response) {
        return null;
      }

      log.debug("Login successful");
      return response;
    } catch (error) {
      log.error("Login failed:", error);
      throw error;
    }
  },

  logout: async () => {
    log.debug("\n=== Logout Attempt ===");
    try {
      const response = await fetchWithAuth("/auth/logout", {
        method: "POST",
      });
      log.debug("Logout successful");
      return response;
    } catch (error) {
      log.error("Logout failed:", error);
      throw error;
    }
  },

  getBreeds: async (): Promise<string[]> => {
    return fetchWithAuth("/dogs/breeds");
  },

  searchDogs: async (params: DogSearchParams): Promise<SearchResponse> => {
    log.debug("\n=== Search Dogs ===");
    log.debug("Search params:", params);

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined) {
        searchParams.append(key, value.toString());
      }
    });

    log.debug("Constructed URL params:", searchParams.toString());
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

  viewLogs: () => {
    const logs = JSON.parse(localStorage.getItem("api_logs") || "[]");
    console.log("=== Stored API Logs ===");
    logs.forEach((msg: string) => console.log(msg));
    return logs;
  },
};
