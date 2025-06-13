const BASE_URL = "http://localhost:3123/cinemas";

export const fetchMovieCities = async (movieId: string): Promise<string[]> => {
  try {
    const cities = await fetch(`${BASE_URL}/movies/${movieId}`, {
      credentials: "include",
    });

    if (!cities.ok) throw new Error("Failed to fetch cities.");
    return cities.json();
  } catch (error: any) {
    throw new Error("An error occured while fetching cities");
  }
};
