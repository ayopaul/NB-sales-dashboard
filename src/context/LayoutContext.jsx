import { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext(undefined);

const DEFAULT_COLLAPSIBLE = 'icon';
const DEFAULT_VARIANT = 'sidebar';

export function LayoutProvider({ children }) {
  const [collapsible, setCollapsible] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_collapsible') || DEFAULT_COLLAPSIBLE;
    }
    return DEFAULT_COLLAPSIBLE;
  });

  const [variant, setVariant] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar_variant') || DEFAULT_VARIANT;
    }
    return DEFAULT_VARIANT;
  });

  useEffect(() => {
    localStorage.setItem('sidebar_collapsible', collapsible);
  }, [collapsible]);

  useEffect(() => {
    localStorage.setItem('sidebar_variant', variant);
  }, [variant]);

  const resetLayout = () => {
    setCollapsible(DEFAULT_COLLAPSIBLE);
    setVariant(DEFAULT_VARIANT);
  };

  return (
    <LayoutContext.Provider
      value={{
        collapsible,
        setCollapsible,
        variant,
        setVariant,
        resetLayout,
        DEFAULT_COLLAPSIBLE,
        DEFAULT_VARIANT,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
