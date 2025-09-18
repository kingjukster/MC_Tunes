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
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      <label>Email <input value={email} onChange={(e)=>setEmail(e.target.value)} /></label><br/>
      <label>Password <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} /></label><br/>
      <button>Sign in</button>
      {msg && <p role="alert">{msg}</p>}
    </form>
  );
}
