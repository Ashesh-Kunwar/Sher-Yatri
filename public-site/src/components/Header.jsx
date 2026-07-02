import { NavLink } from "react-router-dom";
import { useSettings } from "../SettingsContext";

export default function Header() {
  const settings = useSettings();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="brand">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt={settings.name} className="brand-logo" />
          ) : null}
          <span>{settings.name}</span>
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/tours">Tours</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
