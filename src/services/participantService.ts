import { Participant } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function getParticipantByIdService(id: string): Promise<Participant | null> {
  return await prisma.participant.findUnique({
    where: {
      id: id
    }
  });
}

export async function confirmParticipantService(id: string) {
  return await prisma.participant.update({
    where: { id: id },
    data: { is_confirmed: true },
  });
}