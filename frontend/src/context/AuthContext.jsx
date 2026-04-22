import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

// ✅ Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ✅ Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Initialize Auth (SAFE VERSION)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || token === "undefined" || token === "null") {
      setLoading(false);
      return;
    }

    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  // 🔐 Login (FIXED)
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password: password.trim(),
      });

      // ✅ FIXED EXTRACTION
      const user = response.data.data.user;
      const token = response.data.token;

      // ✅ Save token only
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Set user
      setUser(user);

      return { success: true };
    } catch (err) {
      console.error("Login error:", err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
          "Login failed",
      };
    }
  };

  // 📝 Register (FIXED)
  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      // ✅ FIXED EXTRACTION
      const user = response.data.data;
      const token = response.data.token;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return { success: true };
    } catch (err) {
      console.error("Register error:", err);

      return {
        success: false,
        message:
          err.response?.data?.message ||
          err.message ||
          "Registration failed",
      };
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};