export const baseURL = import.meta.env.VITE_API_URL;

export const getRandomRom = () => {
  return `${baseURL}/roms/random/`;
};

export const getRomById = () => {
  return `${baseURL}/roms/id`;
};

export const getRomByCategory = () => {
  return `${baseURL}/roms/gamesByCategory`;
};

export const getCategories = () => {
  return `${baseURL}/categories/`;
};

export const getGamesByCategory = () => {
  return `${baseURL}/roms/gamesByCategoryId`;
};
