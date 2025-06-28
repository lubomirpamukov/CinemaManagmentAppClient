import { useState } from "react";
import { updateUser as updateUserService } from "../services";
import type { TUser } from "../validations";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateUser = async (
    userId: string,
    updates: Partial<TUser & { password?: string }>,
    successMsg: string
  ): Promise<TUser | null> => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const updateUser = await updateUserService(userId, updates);
      setSuccessMessage(successMsg);
      return updateUser;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, loading, error, successMessage };
};
