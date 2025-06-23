const BASE_URL = "http://localhost:3123/auth";

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
    let errorMsg = "Login failed.";
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (error: any) {}
    throw new Error(errorMsg);
  }
};

export const logoutUser = async (): Promise<void> => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    let errorMsg = "Logout failed";
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (error: any) {}
    throw new Error(errorMsg);
  }
};

//this function checks for the role of the loged in person
export const checkAuthStatus = async (): Promise<{ role: string, email:string, id: string }> => {
  const status = await fetch(`${BASE_URL}/check-auth`, {
    method: "GET",
    credentials: "include",
  });

  if (!status.ok) {
    let errorMsg = "Check auth failed";

    try {
      const errorData = await status.json();
      errorMsg = errorData.error || errorMsg;
    } catch (error: any) {}
    throw new Error(errorMsg);
  }
  return status.json();
};
