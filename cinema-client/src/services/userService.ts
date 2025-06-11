import { userSchema } from "../validations";

const BASE_URL = "http://localhost:3123/auth";

export const registerUser = async (userData: any) => {
  try {
    const validatedData = userSchema.parse(userData);

    const registeredUser = await fetch(`${BASE_URL}/register`, {
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
    if (error.errors) { // zod errors
      throw new Error(error.errors.map((err: any) => err.message).join("\n"));
    } else { // other errors
      throw new Error(error.message || "Registration failed.");
    }
  }
};
