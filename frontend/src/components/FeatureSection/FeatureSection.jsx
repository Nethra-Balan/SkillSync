import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FeatureSection.module.css";

const FeatureSection = ({ number, title, description, image, reverse, link }) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(link);
  };

  return (
    <section className={`${styles.section} ${reverse ? styles.reverse : ""}`}>
      <div className={styles.text}>
        <span className={styles.number}>0{number}</span>
        <h2>{title}</h2>
        <p>{description}</p>

        <button className={styles.button} onClick={handleNavigation}>
          Explore {title}
        </button>
      </div>
      <img src={image} alt={title} className={styles.image} />
    </section>
  );
};

export default FeatureSection;
