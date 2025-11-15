import { buses } from "@/data/busData";

export const getBuses = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(buses);
    }, 500);
  });
};