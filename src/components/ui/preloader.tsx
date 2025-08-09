"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export const Preloader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 500); // fade out duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("preloader", !visible && "hidden")}>
      <div className="spinner"></div>
    </div>
  );
};
