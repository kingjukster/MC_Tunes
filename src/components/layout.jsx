import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-y border-gray-700 bg-gray-800/90 backdrop-blur-md">
        <div className="container flex items-center justify-between h-14">
          <nav className="flex gap-4 p-3">
            <Link to="/" className="text-gray-300 hover:text-white">
              MC Tunes
            </Link>
            <Link to="/discover" className="text-gray-300 hover:text-white">
              Discover
            </Link>
            <Link to="/profile" className="text-gray-300 hover:text-white">
              Profile
            </Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              Dashboard
            </Link>
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="container pt-20 text-gray-300">
        <Outlet />
      </main>
    </>
  );
}

