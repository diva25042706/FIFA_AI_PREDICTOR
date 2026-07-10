import axios from "axios";

// Standardizing the base URL to point to our FastAPI backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Setup response interceptors for global error handling if needed
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

// Define API functions
export const api = {
  getDashboardStatus: () => apiClient.get("/dashboard/status"),
  getChampionProbabilities: () => apiClient.get("/predictions/champion"),
  getNextMatch: () => apiClient.get("/predictions/matches/next"),
  getGroupStandings: () => apiClient.get("/groups"),
  getKnockoutBracket: () => apiClient.get("/knockout"),
  getMatch: (id: string) => apiClient.get(`/match/${id}`),
  getAnalyticsXAI: () => apiClient.get("/analytics/xai"),
  getModelMetrics: () => apiClient.get("/models/metrics"),
};
