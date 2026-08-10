import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="app-header">
      <span className="app-header__brand">🕵️ Sherlock AI</span>
      <nav className="app-header__nav">
        <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
          Inicio
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => (isActive ? "active" : "")}>
          Chat
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>
          Acerca de
        </NavLink>
      </nav>
    </header>
  );
}
