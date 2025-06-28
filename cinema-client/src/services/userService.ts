import { userSchema, type TUser } from "../validations";
import { mongooseObjectIdValidationRegex } from "../validations";

const BASE_URL = "http://localhost:3123";

export const registerUser = async (userData: TUser) => {
  try {
    const validatedData = userSchema.parse(userData);

    const registeredUser = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    });

    //handle fail
    if (!registeredUser.ok) {
      let errorMsg = "Registration failed.";
      try {
        const errorData = await registeredUser.json();
        errorMsg = errorData.error || errorMsg;
      } catch (error: any) {}
      throw new Error(errorMsg);
    }

    //handle success
    return await registeredUser.json();
  } catch (error: any) {
    if (error.errors) {
      // zod errors
      throw new Error(error.errors.map((err: any) => err.message).join("\n"));
    } else {
      // other errors
      throw new Error(error.message || "Registration failed.");
    }
  }
};

export const updateUser = async (
  userId: string,
  updates: Partial<TUser & { password?: string }>
): Promise<TUser> => {
  if (!mongooseObjectIdValidationRegex.parse(userId)) {
    throw new Error("Invalid user ID format. Please try again.");
  }
  console.log(updates);
  const userData = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!userData.ok) {
    const errorData = await userData.json();
    throw new Error(errorData.error || "Failed to update user.");
  }
  return userData.json();
};

export const getMe = async () => {
  const myData = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!myData.ok) {
    const errorData = await myData.json();
    throw new Error(errorData.error || "User not Authenticated");
  }

  return myData.json();
};
