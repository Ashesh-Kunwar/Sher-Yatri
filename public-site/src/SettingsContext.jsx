import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const SettingsContext = createContext(null);

const fallback = {
  name: "Sher Yatri",
  tagline: "Every Journey Has a Story.",
  description: "Discover Nepal. Explore the World.",
  logoUrl: "",
  contact: {},
  registration: {},
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(fallback);

  useEffect(() => {
    api.getSettings().then(setSettings).catch(() => {
      // If the backend isn't reachable, the site still renders with sensible defaults
      // rather than breaking entirely.
    });
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
