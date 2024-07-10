import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { confirmTripSchema } from "../validators/trips/confirmTripSchema";
import { prisma } from "../lib/prisma";


export async function confirmTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirm', {
    schema: {
      params: confirmTripSchema
    }
  }, async (req, reply) => {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      }
    })

    if (!trip) {
      throw new Error("Viagem não encontrada!");
    }

    if (trip.is_confirmed) {
      return reply.redirect(`http://localhost:3000/trips/${tripId}`)
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { is_confirmed: true }
    });

    // return { tripId: id }
  })
}