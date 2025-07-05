import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const indicatorRef = useRef(null);
  const navItemsRef = useRef([]);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Connect", path: "/mentorship" },
    { name: "Resources", path: "/resources" },
    { name: "Discussions", path: "/forum" },
    { name: "Quiz", path: "/quiz" },
  ];

  const activeIndex = navLinks.findIndex(link => link.path === location.pathname);

  useEffect(() => {
    const activeItem = navItemsRef.current[activeIndex];
    if (activeItem && indicatorRef.current) {
      indicatorRef.current.style.left = `${activeItem.offsetLeft}px`;
      indicatorRef.current.style.width = `${activeItem.offsetWidth}px`;
    }
  }, [activeIndex]);

  return (
    <nav className={styles.nav}>
      {navLinks.map((link, index) => (
        <Link
          key={index}
          to={link.path}
          ref={el => (navItemsRef.current[index] = el)}
          className={`${styles.navItem} ${index === activeIndex ? styles.active : ""}`}
        >
          {link.name}
        </Link>
      ))}
      <span ref={indicatorRef} className={styles.indicator}></span>
    </nav>
  );
};

export default Navbar;
