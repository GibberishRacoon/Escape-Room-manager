import React, { createContext, useState } from "react";

// kontekst z domyślnymi wartościami
const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isLoggedIn: false, user: null });

  const login = (user) => {
    setAuth({ isLoggedIn: true, user });
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
