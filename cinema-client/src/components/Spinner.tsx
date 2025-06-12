import React from "react";
import styles from "./Spinner.module.css";

type SpinnerProps = {
  size?: "small" | "medium" | "large";
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "medium",
  className = "",
}) => {
  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
    </div>
  );
};

export default Spinner;