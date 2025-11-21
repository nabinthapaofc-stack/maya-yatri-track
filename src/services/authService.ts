import { supabase } from "@/lib/supabaseClient";
import { setAuthUser, getAuthUser, clearAuthUser } from "@/lib/authSession";

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthServiceError";
  }
}

const ensureClient = () => {
  if (!supabase) {
    throw new AuthServiceError("Supabase client is not configured. Check your environment variables.");
  }
  return supabase;
};

const TABLE_NAME = "app_users";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at?: string;
};

export const registerUser = async (params: { name: string; email: string; password: string; role: string }) => {
  const client = ensureClient();

  if (params.role === "admin") {
    throw new AuthServiceError("Admin accounts are provisioned by the platform team only.");
  }

  const existing = await client
    .from(TABLE_NAME)
    .select("id")
    .eq("email", params.email)
    .eq("role", params.role)
    .maybeSingle();

  if (existing.data) {
    throw new AuthServiceError("Account already exists for this role. Please log in instead.");
  }

  const { data, error } = await client
    .from(TABLE_NAME)
    .insert({ name: params.name, email: params.email, password: params.password, role: params.role })
    .select()
    .single();

  if (error || !data) {
    throw new AuthServiceError(error?.message || "Unable to register. Please try again.");
  }

  setAuthUser({ id: data.id, name: data.name, email: data.email, role: data.role });

  return data;
};

export const loginUser = async (params: { email: string; password: string; role: string }) => {
  const client = ensureClient();

  const { data, error } = await client
    .from(TABLE_NAME)
    .select("id, name, email, password, role")
    .eq("email", params.email)
    .eq("role", params.role)
    .maybeSingle();

  if (error) {
    throw new AuthServiceError(error.message);
  }

  if (!data || data.password !== params.password) {
    throw new AuthServiceError("Invalid credentials. Please try again.");
  }

  setAuthUser({ id: data.id, name: data.name, email: data.email, role: data.role });

  return data;
};

export const fetchUserProfile = async (userId: string) => {
  const client = ensureClient();
  const { data, error } = await client
    .from(TABLE_NAME)
    .select("id, name, email, role")
    .eq("id", userId)
    .single();

  if (error) {
    throw new AuthServiceError(error.message);
  }
  return data;
};

export const updateUserProfile = async (userId: string, updates: Partial<AppUser>) => {
  const client = ensureClient();
  const { data, error } = await client
    .from(TABLE_NAME)
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new AuthServiceError(error.message);
  }
  // Update local session if the current user's profile is updated
  const currentUser = getAuthUser();
  if (currentUser && currentUser.id === userId) {
    setAuthUser({ ...currentUser, ...updates });
  }
  return data;
};

export const signOut = async () => {
  try {
    if (supabase && typeof (supabase as any).auth?.signOut === "function") {
      // supabase v2 exposes auth.signOut()
      // call and ignore errors — we'll clear local session regardless
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).auth.signOut();
    }
  } catch (err) {
    // swallow supabase sign-out errors but log for debugging
    // eslint-disable-next-line no-console
    console.warn("supabase signOut failed", err);
  }

  clearAuthUser();
};
