"use client";

import { useEffect, useState } from "react";
import styles from "./Preloader.module.css";

const MINIMUM_DISPLAY_TIME = 900;

export default function Preloader() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let hideTimeout;

    const hidePreloader = () => {
      hideTimeout = window.setTimeout(() => {
        setIsHidden(true);
      }, MINIMUM_DISPLAY_TIME);
    };

    if (document.readyState === "complete") {
      hidePreloader();
    } else {
      window.addEventListener("load", hidePreloader, { once: true });
    }

    return () => {
      window.removeEventListener("load", hidePreloader);
      window.clearTimeout(hideTimeout);
    };
  }, []);

  return (
    <div
      className={`${styles.overlay} ${isHidden ? styles.hidden : ""}`}
      role="status"
      aria-label="Loading Forty Eight"
      aria-hidden={isHidden}
    >
      <div className={styles.content}>
        <p className={styles.eyebrow}>CONTEMPORARY CLOTHING</p>
        <h1 className={styles.brand}>FORTY EIGHT</h1>
        <span className={styles.loader} aria-hidden="true" />
        <p className={styles.loadingText}>LOADING YOUR EXPERIENCE</p>
      </div>
    </div>
  );
}
