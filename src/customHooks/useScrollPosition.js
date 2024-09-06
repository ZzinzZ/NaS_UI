"use client"
import { useState, useEffect } from "react";

const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: window.scrollX,
    y: window.scrollY,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({ x: window.scrollX, y: window.scrollY });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    x: scrollPosition.x,
    y: scrollPosition.y,
  };
};

export default useScrollPosition;
