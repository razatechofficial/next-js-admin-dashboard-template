import ThemeSwitch from "@/components/Theme/ThemeSwitcher";
import React from "react";

const Home = () => {
  return (
    <div className="bg-green-400 dark:bg-red-500">
      Theme testing
      <div>
        <ThemeSwitch />
      </div>
    </div>
  );
};

export default Home;
