import { Trip } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function getTripByIdService(id: string): Promise<Trip | null> {
  return await prisma.trip.findUnique({
    where: {
      id
    }
  });
}