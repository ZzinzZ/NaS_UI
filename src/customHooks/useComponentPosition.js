"use client"

import { useState, useEffect } from 'react';

const useComponentPosition = (ref) => {
  const [position, setPosition] = useState({ top: 0, bottom: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPosition({ top: rect.top, bottom: rect.bottom });
      }
    };

    updatePosition();

    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [ref]);

  return position;
};

export default useComponentPosition;
