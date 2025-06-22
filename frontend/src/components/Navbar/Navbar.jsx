import React, { useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const indicatorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const navItemsRef = useRef([]);

  const menuItems = ["Home", "profile", "resources", "mentorship", "forum"];

  useEffect(() => {
    const activeItem = navItemsRef.current[activeIndex];
    if (activeItem && indicatorRef.current) {
      indicatorRef.current.style.left = `${activeItem.offsetLeft}px`;
      indicatorRef.current.style.width = `${activeItem.offsetWidth}px`;
    }
  }, [activeIndex]);

  return (
    <nav className={styles.nav}>
      {menuItems.map((label, index) => (
        <a
          key={index}
          href="#"
          className={`${styles.navItem} ${activeIndex === index ? styles.active : ""}`}
          ref={(el) => (navItemsRef.current[index] = el)}
          onClick={() => setActiveIndex(index)}
        >
          {label}
        </a>
      ))}
      <div className={styles.indicator} ref={indicatorRef}></div>
    </nav>
  );
};

export default Navbar;
