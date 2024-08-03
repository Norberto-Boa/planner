import { Trip } from "@prisma/client";
import { prisma } from "../lib/prisma";
import z from "zod";
import { createTripSchema } from "../validators/trips/createTripSchema";

type createTripDTO = z.infer<typeof createTripSchema>;

// Create Trip
export async function createTrip({ destination, emails_to_invite, ends_at, owner_email, owner_name, starts_at }: createTripDTO) {
  return await prisma.trip.create({
    data: {
      destination,
      starts_at,
      ends_at,
      participants: {
        createMany: {
          data: [
            {
              email: owner_email,
              name: owner_name,
              is_owner: true,
              is_confirmed: true,
            },
            ...emails_to_invite.map(email => {
              return { email }
            })
          ]
        }
      }
    }
  })
}

// Get Trip by Trip Id
export async function getTripByIdService(id: string): Promise<Trip | null> {
  return await prisma.trip.findUnique({
    where: {
      id
    }
  });
}

