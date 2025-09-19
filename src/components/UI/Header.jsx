
import { NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import '../../style/Header.css';

export const Header = () => {
  const toggleMenu = () => {
    const nav = document.querySelector('.nav-links');
    if (nav) {
      nav.classList.toggle('active');
    }
  };
  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-grid">
          
          {/* Logo */}
          <div className="logo">
            <NavLink to="/">
              <h1>
                <span className="theme">Pulse</span>
                <span className="black">Plush</span>
              </h1>
            </NavLink>
          </div>

          {/* Hamburger (mobile) */}
          <button className="hamburger" aria-label="Toggle navigation" onClick={toggleMenu}>
            <HiOutlineMenuAlt3 size={28} />
          </button>

          {/* Navigation Links */}
          <nav className="nav-links">
            <ul>
              <li>
                <NavLink to="/" end>Home</NavLink>
              </li>
              <li>
                <NavLink to="/find-donor">Find Donor</NavLink>
              </li>
              <li>
                <NavLink to="/about">About Us</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
              {/* Mobile-only auth links */}
              <li className="mobile-only">
                <NavLink to="/login">Login</NavLink>
              </li>
              <li className="mobile-only">
                <NavLink to="/register">Register</NavLink>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            <NavLink to="/login" className="login-btn">Login</NavLink>
            <NavLink to="/register" className="register-btn">Register</NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};
