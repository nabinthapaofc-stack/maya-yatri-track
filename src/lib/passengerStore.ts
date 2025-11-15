import { getBuses } from "@/services/busService";
export type BusSnapshot = {
  id: number;
  route: string;
  number: string;
  eta: string;
  distance: string;
  occupancy: string;
  seats: number;
  driverId?: string;
  driverName?: string;
  coordinates: [number, number];
};

export type PassengerHistoryEntry = BusSnapshot & {
  requestId: string;
  requestedAt: string;
  status: "pending" | "acknowledged" | "completed";
};

export type DriverRequest = PassengerHistoryEntry;

const HISTORY_KEY = "myatri:passenger-history";
const DRIVER_REQUESTS_KEY = "myatri:driver-requests";

const listeners = new Set<() => void>();

const isBrowser = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("Unable to parse stored value", error);
    return fallback;
  }
};

const readStore = <T>(key: string, fallback: T): T => {
  if (!isBrowser()) return fallback;
  return safeParse(window.localStorage.getItem(key), fallback);
};

const writeStore = (key: string, value: unknown) => {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const subscribeToPassengerStore = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const busStore: { buses: BusSnapshot[] } = {
  buses: [],
};

export const fetchBuses = async () => {
  const buses = (await getBuses()) as BusSnapshot[];
  busStore.buses = buses;
  notify();
};
export const getPassengerHistory = (): PassengerHistoryEntry[] => {
  return readStore<PassengerHistoryEntry[]>(HISTORY_KEY, []).sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
};

export const getDriverRequests = (): DriverRequest[] => {
  return readStore<DriverRequest[]>(DRIVER_REQUESTS_KEY, []).sort((a, b) => (a.requestedAt < b.requestedAt ? 1 : -1));
};

const persistHistory = (entries: PassengerHistoryEntry[]) => {
  writeStore(HISTORY_KEY, entries);
};

const persistDriverRequests = (entries: DriverRequest[]) => {
  writeStore(DRIVER_REQUESTS_KEY, entries);
};

export const recordPassengerRequest = (bus: BusSnapshot) => {
  const entry: PassengerHistoryEntry = {
    ...bus,
    requestId: `${bus.id}-${Date.now()}`,
    requestedAt: new Date().toISOString(),
    status: "pending",
  };

  const updatedHistory = [entry, ...getPassengerHistory()];
  const updatedDriverRequests = [entry, ...getDriverRequests()];

  persistHistory(updatedHistory);
  persistDriverRequests(updatedDriverRequests);

  notify();
  return entry;
};

export const updateDriverRequestStatus = (requestId: string, status: PassengerHistoryEntry["status"]) => {
  const history = getPassengerHistory();
  const driverRequests = getDriverRequests();

  const updatedHistory = history.map((entry) =>
    entry.requestId === requestId
      ? {
          ...entry,
          status,
        }
      : entry,
  );

  const updatedDriverRequests = driverRequests.map((entry) =>
    entry.requestId === requestId
      ? {
          ...entry,
          status,
        }
      : entry,
  );

  persistHistory(updatedHistory);
  persistDriverRequests(updatedDriverRequests);
  notify();
};

export const clearPassengerData = () => {
  persistHistory([]);
  persistDriverRequests([]);
  notify();
};
