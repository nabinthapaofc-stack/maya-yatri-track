import { supabase } from "@/lib/supabaseClient";

export class DriverServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DriverServiceError";
  }
}

const ensureClient = () => {
  if (!supabase) {
    throw new DriverServiceError("Supabase client is not configured. Check your environment variables.");
  }
  return supabase;
};

export type DriverRecord = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  license_number: string;
  created_at: string;
};

export type BusRecord = {
  id: string;
  driver_id: string;
  bus_name: string;
  company_name: string;
  route: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export type DriverProfileResponse = DriverRecord & {
  buses: BusRecord[];
};

export const fetchDriverProfile = async (userId: string) => {
  const client = ensureClient();
  const { data, error } = await client
    .from("drivers")
    .select("*, buses(*)")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new DriverServiceError(error.message);
  }

  return data as DriverProfileResponse | null;
};

export const registerDriverAndBus = async (params: {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  licenseNumber: string;
  busName: string;
  companyName: string;
  route: string;
}) => {
  const client = ensureClient();

  const { data: existingDriver } = await client
    .from("drivers")
    .select("id")
    .eq("user_id", params.userId)
    .maybeSingle();

  if (existingDriver) {
    throw new DriverServiceError("You have already submitted your driver profile.");
  }

  const { data: driver, error: driverError } = await client
    .from("drivers")
    .insert({
      user_id: params.userId,
      name: params.name,
      email: params.email,
      phone: params.phone ?? null,
      license_number: params.licenseNumber,
    })
    .select()
    .single();

  if (driverError || !driver) {
    throw new DriverServiceError(driverError?.message || "Unable to save driver profile.");
  }

  const { data: bus, error: busError } = await client
    .from("buses")
    .insert({
      driver_id: driver.id,
      bus_name: params.busName,
      company_name: params.companyName,
      route: params.route,
    })
    .select()
    .single();

  if (busError || !bus) {
    throw new DriverServiceError(busError?.message || "Unable to save bus details.");
  }

  return { driver: driver as DriverRecord, bus: bus as BusRecord };
};

export const updateDriverProfile = async (
  userId: string,
  driverUpdates: Partial<Omit<DriverRecord, "id" | "user_id" | "created_at">>,
  busUpdates: Partial<Omit<BusRecord, "id" | "driver_id" | "created_at" | "status">>
) => {
  const client = ensureClient();

  // Fetch the driver to get driver_id and bus_id
  const { data: driverProfile, error: fetchError } = await client
    .from("drivers")
    .select("id, buses(id)")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError || !driverProfile) {
    throw new DriverServiceError(fetchError?.message || "Driver profile not found.");
  }

  const driverId = driverProfile.id;
  const busId = driverProfile.buses?.[0]?.id;

  // Update driver record
  const { error: driverError } = await client
    .from("drivers")
    .update(driverUpdates)
    .eq("id", driverId);

  if (driverError) {
    throw new DriverServiceError(driverError.message);
  }

  // Update bus record if busUpdates are provided and a bus exists
  if (busId && Object.keys(busUpdates).length > 0) {
    const { error: busError } = await client
      .from("buses")
      .update(busUpdates)
      .eq("id", busId);

    if (busError) {
      throw new DriverServiceError(busError.message);
    }
  }

  // Re-fetch the updated profile to return the latest state
  return fetchDriverProfile(userId);
};
