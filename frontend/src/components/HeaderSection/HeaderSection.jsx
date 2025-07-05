import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HeaderSection.module.css";

const HeaderSection = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/mentorship");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <h1>
          Level Up Your Skills with <span>Skill<span>Sync</span></span>
        </h1>
        <p>Connect. Sync. Grow.</p>
        <button className={styles.button} onClick={handleNavigation}>
          Get Connected
        </button>
      </div>
    </section>
  );
};

export default HeaderSection;
