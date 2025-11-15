export type AuthSessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const STORAGE_KEY = "myatri:auth-user";

export const setAuthUser = (user: AuthSessionUser) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getAuthUser = (): AuthSessionUser | null => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSessionUser;
  } catch (error) {
    console.warn("Failed to parse auth session", error);
    return null;
  }
};

export const clearAuthUser = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};
