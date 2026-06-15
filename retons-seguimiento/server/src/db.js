import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Helpers para los campos JSON guardados como String (portables sqlite/postgres)
export const parseJSON = (str, fallback = {}) => {
  try {
    return JSON.parse(str ?? "");
  } catch {
    return fallback;
  }
};

export const stringifyJSON = (obj) => JSON.stringify(obj ?? {});
