import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      const authenticatedUser = data.user || data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return { ...data, user: authenticatedUser };
    } catch (error) {
      // Re-throw with proper error structure
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const data = await authService.register(payload);
      return data;
    } catch (error) {
      // Re-throw with proper error structure
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
