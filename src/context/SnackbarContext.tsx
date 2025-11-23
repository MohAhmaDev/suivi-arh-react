import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface SnackbarValue {
   message: string | null;
   showMessage: (msg: string) => void;
   clearMessage: () => void;
}

const SnackbarContext = createContext<SnackbarValue | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
   const [message, setMessage] = useState<string | null>(null);

   const showMessage = useCallback((text: string) => setMessage(text), []);
   const clearMessage = useCallback(() => setMessage(null), []);

   return (
      <SnackbarContext.Provider value={{ message, showMessage, clearMessage }}>
         {children}
      </SnackbarContext.Provider>
   );
};

export const useSnackbar = () => {
   const ctx = useContext(SnackbarContext);
   if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
   return ctx;
};