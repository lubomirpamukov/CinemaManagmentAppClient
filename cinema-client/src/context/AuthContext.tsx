import React, { createContext, useEffect, useState } from "react";
import { logoutUser, getMe, loginUser } from "../services";
import type { TUserResponse } from "../validations";

type AuthUser = TUserResponse & { id: string; role: string };

type AuthContextType = {
  isAuthenticated: boolean;
  user: AuthUser | null; // 1. Expose the entire user object
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>; // 2. Expose setUser for updates
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  //Derive isAuthenticated directly from the user state
  const isAuthenticated = !!user;

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const loggedInUser = await getMe();
        setUser(loggedInUser);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await loginUser(email, password);
      const loggedInUser = await getMe();
      setUser(loggedInUser);
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setUser,
        logout: handleLogout,
        login: handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
