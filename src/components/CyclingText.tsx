"use client";

import { useState, useEffect } from "react";

const ERAS = ["Rocawear Era.", "Sean John Era.", "G-Unit Era.", "Dipset Era."];

export default function CyclingText() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ERAS.length);
        setFading(false);
      }, 400);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className="inline-block transition-opacity duration-400"
      style={{
        opacity: fading ? 0 : 1,
        transition: "opacity 0.4s ease",
        minWidth: "220px",
      }}
    >
      {ERAS[index]}
    </span>
  );
}
