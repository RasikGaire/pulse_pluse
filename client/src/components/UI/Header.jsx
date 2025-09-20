
import { NavLink } from "react-router-dom";
import { HiOutlineMenuAlt3 } from 'react-icons/hi';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import '../../style/Header.css';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    const nav = document.querySelector('.nav-links');
    if (nav) {
      nav.classList.toggle('active');
    }
  };

  const handleLogout = () => {
    logout();
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
              {!isAuthenticated() ? (
                <>
                  <li className="mobile-only">
                    <NavLink to="/login">Login</NavLink>
                  </li>
                  <li className="mobile-only">
                    <NavLink to="/register">Register</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li className="mobile-only">
                    <NavLink to="/profile">Profile</NavLink>
                  </li>
                  <li className="mobile-only">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="auth-buttons">
            {!isAuthenticated() ? (
              <>
                <NavLink to="/login" className="login-btn">Login</NavLink>
                <NavLink to="/register" className="register-btn">Register</NavLink>
              </>
            ) : (
              <>
                <span className="user-greeting">Welcome, {user?.fullName}</span>
                {/* Notification Button */}
                <button className="notification-btn" aria-label="Notifications">
                  <FaBell size={18} />
                  <span className="notification-badge">3</span>
                </button>
                <NavLink to="/profile" className="profile-btn">Profile</NavLink>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
