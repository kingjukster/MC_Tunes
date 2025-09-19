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
    <div className="w-full flex flex-col items-center">
      <div className="emo-card w-full max-w-2xl">
        <h1 className="text-4xl font-emo text-blood emo-glitch mb-4">Metrics</h1>
        <pre className="bg-jet bg-opacity-80 rounded p-4 text-pale text-sm overflow-x-auto">
          {metrics ? JSON.stringify(metrics, null, 2) : "Loading…"}
        </pre>
      </div>
    </div>
  );
}
