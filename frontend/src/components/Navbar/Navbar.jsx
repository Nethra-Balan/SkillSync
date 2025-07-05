import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const indicatorRef = useRef(null);
  const navItemsRef = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Connect", path: "/mentorship" },
    { label: "Resources", path: "/resources" },
    { label: "Discussions", path: "/forum" },
    { label: "Quiz", path: "/quiz" }
  ];

  
  const activeIndex = menuItems.findIndex(item => item.path === location.pathname);

  useEffect(() => {
    const activeItem = navItemsRef.current[activeIndex];
    if (activeItem && indicatorRef.current) {
      indicatorRef.current.style.left = `${activeItem.offsetLeft}px`;
      indicatorRef.current.style.width = `${activeItem.offsetWidth}px`;
    }
  }, [activeIndex, location.pathname]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

const handleLogout = () => {
  localStorage.removeItem("token");
  setShowDropdown(false);
  window.location.replace("/login"); // Hard redirect, clears history
};


  return (
    <nav className={styles.nav}>
      <div className={styles.navLinks}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`${styles.navItem} ${activeIndex === index ? styles.active : ""}`}
            ref={(el) => (navItemsRef.current[index] = el)}
          >
            {item.label}
          </Link>
        ))}
        <div className={styles.indicator} ref={indicatorRef}></div>
      </div>

      <div className={styles.profileContainer}>
        <i className={`bi bi-person-circle ${styles.profileIcon}`} onClick={toggleDropdown}></i>
        {showDropdown && (
          <div className={styles.dropdown}>
            <Link to="/profile" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>Profile</Link>
            <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
