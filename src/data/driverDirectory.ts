export type DriverProfile = {
  driverId: string;
  name: string;
  busNumber: string;
  busType: string;
  rating: number;
  avatarColor: string;
  recentRoutes: { label: string; timestamp: string }[];
  recentLocation: string;
};

export const DRIVER_DIRECTORY: Record<string, DriverProfile> = {};
