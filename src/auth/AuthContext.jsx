import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(
    localStorage.getItem("userToken")
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  /* ================= LOGIN ================= */
  const login = ({ token, user }) => {

    // USER TOKEN
    localStorage.setItem("userToken", token);

    // USER DATA
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  /* ================= LOGOUT ================= */
  const logout = () => {

    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);