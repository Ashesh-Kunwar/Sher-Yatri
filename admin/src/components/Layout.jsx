import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">Sher Yatri</div>
        <div className="sidebar-sub">Admin Panel</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/tours">Tours</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/customers">Customers</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">{user?.name} ({user?.role})</div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
