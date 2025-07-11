import { useState } from "react";
import { updateUser as updateUserService } from "../services";
import type { TUserResponse, TUserUpdate } from "../validations";

/**
 * Provides a function to update user information and manages the associated loading and error
 * This hook does not take any parameters itself.
 *
 * @returns {{
 *  updateUser: (userId: string, updates: TUserUpdate, successMsg: string) => Promise<TUserResponse> | null;
 *  loading: boolean;
 *  error: string | null;
 *  successMessage: string | null;
 * }}
 */
export const useUpdateUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Updates a user's information.
   * @param {string} userId The ID of the user to update.
   * @param {TUserResponse} updates An object containing fields to update.
   * @param {string} successMsg The message to display on successful update.
   * @returns {Promise<TUserResponse | null>} The updated user object or null if an error occurred.
   */
  const updateUser = async (
    userId: string,
    updates: TUserUpdate,
    successMsg: string
  ): Promise<TUserResponse | null> => {
    if (!userId || Object.keys(updates).length === 0) {
      setError("User ID and update data are required.");
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updatedUser = await updateUserService(userId, updates);
      setSuccessMessage(successMsg);
      return updatedUser;
    } catch (error: any) {
      setError(error.message || "An unknown error occurred during the update.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, successMessage };
};
