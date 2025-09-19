import { Outlet, Link } from "react-router-dom";
import logo from "../assets/mc_tunes_logo.png";

export default function Layout() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-y border-gray-700 bg-gray-800/90 backdrop-blur-md">
        <div className="container flex items-center justify-between h-20">
          <nav className="flex items-center gap-8 w-full">
            <Link to="/" className="flex items-center gap-2 group mr-8">
              <img src={logo} alt="MC Tunes logo" className="h-12 w-12 emo-fade" />
              <span className="text-2xl font-emo text-blood emo-glitch tracking-tight group-hover:text-violet transition-colors">MC Tunes</span>
            </Link>
            <div className="flex gap-6 text-lg font-semibold items-center h-full">
              <Link to="/discover" className="hover:text-blood transition-colors">Discover</Link>
              <Link to="/profile" className="hover:text-blood transition-colors">Profile</Link>
              <Link to="/dashboard" className="hover:text-blood transition-colors">Dashboard</Link>
              <Link to="/login" className="hover:text-blood transition-colors">Login</Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center min-h-[80vh] pt-32">
        <Outlet />
      </main>
    </>
  );
}

