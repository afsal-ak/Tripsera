import { createContext, useContext, useState } from 'react';

type AuthModalContextType = {
  openLogin: () => void;
  closeLogin: () => void;
  isOpen: boolean;
};

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openLogin = () => setIsOpen(true);
  const closeLogin = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ openLogin, closeLogin, isOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) throw new Error('useAuthModal must be used inside provider');
  return context;
};