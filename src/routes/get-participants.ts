import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { tripIdAsParamsSchema } from "../validators/global";

export async function getParticipants(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/participants', {
    schema: {
      params: tripIdAsParamsSchema
    }
  }, async (req) => {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            is_confirmed: true,
            is_owner: true
          }
        },
      }
    });

    if (!trip) {
      throw new Error("Viagem nao encontrada!");
    }

    return { participants: trip.participants };
  });
}