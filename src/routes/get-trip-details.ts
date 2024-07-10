import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { createLinksParamsSchema } from "../validators/links/createLinksSchema";

export async function getTripDetails(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId', {
    schema: {
      params: createLinksParamsSchema
    }
  }, async (req) => {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        participants: {
          where: {
            is_owner: true
          },
          select: {
            email: true
          }
        }
      }
    })

    if (!trip) {
      throw new Error("Viagem nao encontrada!");
    }

    return { trip };
  });
}