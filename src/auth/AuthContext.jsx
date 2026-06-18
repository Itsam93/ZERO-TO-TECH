import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("userToken") || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Invalid stored user JSON:", err);
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const timeoutRef = useRef(null);

  const login = ({ token, user }) => {
    if (!token || !user) {
      console.error("Login failed: token or user missing", { token, user });
      return;
    }

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
      setLoading(false);
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

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];

    resetTimer();
    events.forEach((event) => window.addEventListener(event, resetTimer));

    setLoading(false);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      events.forEach((event) =>
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
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);