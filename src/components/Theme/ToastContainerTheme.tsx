"use client";
import { useCurrentTheme } from "@/hooks/useCurrentTheme";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { ToastContainer } from "react-toastify";

const ToastContainerTheme = () => {
  const theme = useCurrentTheme();
  return (
    <div>
      <ToastContainer theme={theme === "dark" ? "dark" : "light"} />
    </div>
  );
};

export default ToastContainerTheme;
