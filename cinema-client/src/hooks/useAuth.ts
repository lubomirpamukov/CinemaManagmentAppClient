import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Provides access to the authentication context.
 * This hook must be used within a component wrapped by the AuthProvider.
 * 
 * @returns {AuthContextType} The authentication context, containing user data and auth functions.
 * @throws {Error} Throws an error if the hook is used outside of an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
