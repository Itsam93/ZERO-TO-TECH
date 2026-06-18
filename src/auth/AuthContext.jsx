import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("userToken") || null
  );

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const timeoutRef = useRef(null);

  const login = ({ token, user }) => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  };

  const logout = (isAuto = false) => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isAuto) {
      toast("Session expired due to inactivity.", {
        icon: "🔒",
        style: {
          borderRadius: "12px",
          background: "#0f172a",
          color: "#fff",
          fontWeight: "600",
        },
      });
    }
  };

  useEffect(() => {
    if (!token) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        logout(true);
      }, INACTIVITY_TIMEOUT);
    };

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    resetTimer();

    activityEvents.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout: () => logout(false),
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);