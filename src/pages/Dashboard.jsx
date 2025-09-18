import { useEffect, useState } from "react";
import { api } from "../services/apiClient.js";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/metrics");
        setMetrics(data);
      } catch {}
    })();
  }, []);
  return (
    <div>
      <h1>Metrics</h1>
      <pre>{metrics ? JSON.stringify(metrics, null, 2) : "Loading…"}</pre>
    </div>
  );
}
