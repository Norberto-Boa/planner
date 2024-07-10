import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { createActivityParamsSchema } from "../validators/activity/createActivity";
import { dayjs } from "../lib/formatDate";
import { ClientError } from "../errors/client-error";

export async function getActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/activities', {
    schema: {
      params: createActivityParamsSchema
    }
  }, async (req) => {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: {
        id: tripId
      },
      include: {
        acitivities: {
          orderBy: {
            occurs_at: "asc"
          }
        }
      }
    });

    if (!trip) {
      throw new ClientError("Viagem nao encontrada!");
    }

    const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(trip.starts_at, "days");

    const activities = Array.from({ length: differenceInDaysBetweenTripStartAndEnd + 1 }).map((_, index) => {
      const date = dayjs(trip.starts_at).add(index, 'days');

      return {
        date: date.toDate(),
        activities: trip.acitivities.filter(activity => {
          return dayjs(activity.occurs_at).isSame(date, "day");
        })
      }
    });

    return activities;
  });
}