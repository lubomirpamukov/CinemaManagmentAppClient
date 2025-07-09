const BASE_URL = "http://localhost:3123/auth";
/**
 * Attempts to log in a user with the provided credentials.
 *
 * Sends a POST request to the backend and, if successful,
 * sets a temporary authentication cookie via the server.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @throws {Error} If login fails, throws an error with a message and status from the server or a generic message.
 * @returns {Promise<void>} Resolves if login is successful.
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<void> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorMsg = `Login failed. From ${BASE_URL}/login: ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`
      }
    } catch (error: any) {}
    throw new Error(errorMsg);
  }
};

/**
 * Attempts to logout the current user.
 * 
 * Sends a POST request to the backend "/logout" endpoint. If successful,
 * the server removes authentication cookie.
 * @throws {Error} If logout fails, throws an error with a message and status from the server or a generic message.
 * @returns {Promise<void>} Resolves if logout is successful.
 */
export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMsg = `Logout failed. From ${BASE_URL}/logout : ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMsg += ` - ${errorData.message}`
      }
    } catch (error: any) {}
    throw new Error(errorMsg);
  }
};

/**
 * Sends authentication cookie of the currently logedin user to the backend endpoint "/check-auth" for validation.
 * @throws {Error} If authentication is not successful, throws an error with a message and status from the server or a generic message.
 * @returns {Promise<{role: string, email: string, id:string}>} Respolves with the user's role, email and id if authenticated. 
 */
export const checkAuthStatus = async (): Promise<{
  role: string;
  email: string;
  id: string;
}> => {
  const response = await fetch(`${BASE_URL}/check-auth`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMsg = `Check auth failed. From ${BASE_URL}/check-auth : ${response.status}`;

    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (error: any) {
      errorMsg = error.message || errorMsg;
    }
    throw new Error(errorMsg);
  }
  return response.json();
};
