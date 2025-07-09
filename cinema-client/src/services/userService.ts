import { ZodError } from "zod";
import {
  userSchema,
  userResponseSchema,
  type TUserResponse,
  type TUser,
} from "../validations";
import { mongooseObjectIdValidationRegex } from "../validations";

const BASE_URL = "http://localhost:3123";

/**
 * Registers a new user with the provided data.
 *
 * @param {TUser} userData - The user data for registration.
 * @throws {Error} Throws a detailed error if input validation fails, the request fails, or the server response is malformed.
 * @returns {Promise<TUserResponse>} A promise that resolves to the newly created user object (without the password).
 */
export const registerUser = async (userData: TUser) => {
  const validatedData = userSchema.parse(userData);

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      let errMsg = `Registration failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errMsg += ` - ${errorData.message}`;
        }
      } catch (error) {}
      throw new Error(errMsg);
    }

    const userData = await response.json();
    return userResponseSchema.parse(userData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `Server response validation failed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};

/**
 * Updates a user's profile with the provided data.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {Partial<TUser & { password?: string }>} updates - An object containing the fields to update.
 * @throws {Error} Throws an error if the user ID is invalid, the update data is invalid, the request fails, or the server response is malformed.
 * @returns {Promise<TUserResponse>} A promise that resolves to the updated user object (without the password).
 */
export const updateUser = async (
  userId: string,
  updates: Partial<TUser & { password?: string }>
): Promise<TUserResponse> => {
  try {
    if (!mongooseObjectIdValidationRegex.parse(userId)) {
      throw new Error("Invalid user ID format. Please try again.");
    }

    const validateUpdates = userSchema.partial().parse(updates);

    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateUpdates),
    });

    //handle non-successful http responses
    if (!response.ok) {
      let errMsg = `Failed to update user. Status: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errMsg += ` - ${errorData.message}`;
        }
      } catch (error) {}
      throw new Error(errMsg);
    }

    const userData = await response.json();
    return userResponseSchema.parse(userData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `User update validation failed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};

/**
 * Fetches the currently authenticated user's profile data.
 *
 * @throws {Error} Throws an error if the user is not authenticated, the request fails, or the server response is malformed.
 * @returns {Promise<TUserResponse>} A promise that resolves to the authenticated user's data.
 */
export const getMe = async (): Promise<TUserResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errMsg = `Authentication check failed: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errMsg += ` - ${errorData.message}`;
        }
      } catch (error) {}
      throw new Error(errMsg);
    }

    const userData = await response.json();

    // Validate the response to ensure it matches the expected user structure
    return userResponseSchema.parse(userData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `User data validation failed: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
    }
    throw error;
  }
};
