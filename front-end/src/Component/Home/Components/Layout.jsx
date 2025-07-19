import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <nav className="sidebar">
        <h2>My Digital Locker</h2>
        <ul>
          <li><Link to="/home">🏠 Home</Link></li>
          <li><Link to="/files">📁 My Files</Link></li>
          <li><Link to="/upload">⬆️ Upload</Link></li>
        </ul>
      </nav>

      {/* Main area */}
      <div className="main-area">
        {/* Topbar */}
        <header className="topbar">
          <p>Welcome back 👋</p>
          <button className="logout-btn" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = "/";
          }}>Logout</button>
        </header>

        {/* Page content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
