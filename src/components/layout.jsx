import { Outlet, Link } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="container flex items-center justify-between h-14">
        {
          <nav style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
            <Link to="/">MC Tunes</Link> &nbsp;|&nbsp;
            <Link to="/discover">Discover</Link> &nbsp;|&nbsp;
            <Link to="/profile">Profile</Link> &nbsp;|&nbsp;
            <Link to="/dashboard">Dashboard</Link> &nbsp;|&nbsp;
            <Link to="/login">Login</Link>
          </nav>
        }
      </div>
    </header>

    <main className="container pt-20">
      <Outlet />
    </main>
    </>
  );
}

