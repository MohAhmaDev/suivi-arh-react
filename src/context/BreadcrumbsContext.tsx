import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useEffect } from 'react';
import { useMatches } from 'react-router-dom';

interface BreadcrumbsContextValue {
  labels: Record<string, string>;
  registerLabel: (routeId: string, label: string) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | undefined>(undefined);

export const BreadcrumbsProvider = ({ children }: { children: ReactNode }) => {
  const [labels, setLabels] = useState<Record<string, string>>({});

  const registerLabel = useCallback((routeId: string, label: string) => {
    setLabels((prev) => {
      if (prev[routeId] === label) return prev;
      return { ...prev, [routeId]: label };
    });
  }, []);

  const value = useMemo(() => ({ labels, registerLabel }), [labels, registerLabel]);

  return <BreadcrumbsContext.Provider value={value}>{children}</BreadcrumbsContext.Provider>;
};

export const useBreadcrumbsRegistry = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('useBreadcrumbsRegistry must be used within BreadcrumbsProvider');
  }
  return context;
};

export const useDynamicBreadcrumb = (label?: string | null) => {
  const { registerLabel } = useBreadcrumbsRegistry();
  const matches = useMatches();

  useEffect(() => {
    if (!label) return;
    const currentMatch = matches[matches.length - 1];
    if (!currentMatch?.id) return;
    registerLabel(currentMatch.id, label);
  }, [label, matches, registerLabel]);
};
