// LogoContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import useFetchLguSettings from '../hooks/SettingsHook/useFetchLguSettings';

const LogoContext = createContext();

export const LogoProvider = ({ children }) => {
  const { lguSettings, loading, error } = useFetchLguSettings();
  const [logoUrl, setLogoUrl] = useState(lguSettings?.lguLogo);

  useEffect(() => {
    if (lguSettings) {
      setLogoUrl(lguSettings.lguLogo);
    }
  }, [lguSettings]);

  return (
    <LogoContext.Provider value={{ logoUrl, loading, error }}>
      {children}
    </LogoContext.Provider>
  );
};

export const useLogo = () => useContext(LogoContext);
