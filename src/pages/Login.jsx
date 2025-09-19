import { useState } from "react";
import { login } from "../services/auth.js";
import { useAppStore } from "../app/store.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [msg, setMsg] = useState("");
  const setUser = useAppStore((s) => s.setUser);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const data = await login(email, pw);
      setUser({ email: data.email, userId: data.userId, token: data.token });
      setMsg("Logged in");
    } catch {
      setMsg("Login failed");
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={onSubmit} className="emo-card w-full max-w-md flex flex-col gap-4">
        <h2 className="text-3xl font-emo text-blood emo-glitch mb-2">Login</h2>
        <label className="flex flex-col text-pale">
          Email
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 px-2 py-1 rounded bg-ash text-pale border-2 border-violet focus:border-blood focus:ring-2 focus:ring-blood focus:outline-none transition-all" />
        </label>
        <label className="flex flex-col text-pale">
          Password
          <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} className="mt-1 px-2 py-1 rounded bg-ash text-pale border-2 border-violet focus:border-blood focus:ring-2 focus:ring-blood focus:outline-none transition-all" />
        </label>
        <button className="mt-2 px-4 py-2 rounded bg-blood text-white font-semibold hover:bg-violet transition-colors">Sign in</button>
        {msg && <p role="alert" className="text-center text-violet mt-2">{msg}</p>}
      </form>
    </div>
  );
}
