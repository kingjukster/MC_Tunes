import { api } from "./apiClient";

export async function fetchRecommendations(params) {
  const { data } = await api.get("/api/recommendations", { params });
  return data;
}
export async function rateTrack(trackId, rating) {
  await api.post("/api/ratings", { trackId, rating });
}
