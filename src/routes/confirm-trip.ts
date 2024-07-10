import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { confirmTripSchema } from "../validators/trips/confirmTripSchema";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { formatDate } from "../lib/formatDate";
import nodemailer from 'nodemailer';
import { ClientError } from "../errors/client-error";


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
      },
      include: {
        participants: {
          where: {
            is_owner: false
          }
        }
      }
    });

    if (!trip) {
      throw new ClientError("Viagem não encontrada!");
    }

    if (trip.is_confirmed) {
      return reply.redirect(`http://localhost:3000/trips/${tripId}`)
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { is_confirmed: true }
    });


    const mail = await getMailClient();

    const formattedStartDate = formatDate(trip.starts_at)
    const formattedEndDate = formatDate(trip.ends_at);

    await Promise.all(
      trip.participants.map(async (participant) => {
        const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`
        const message = await mail.sendMail({
          from: {
            name: "Equip Plann.er",
            address: "planner@anytech.co.mz"
          },
          to: participant.email,
          subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
          html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p></p>
              <p>
                <a href="${confirmationLink}">Confirmar viagem</a>
              </p>
              <p></p>
              <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
            `.trim()
        });
        console.log(nodemailer.getTestMessageUrl(message));
      })
    )

    return { trip };
  })
}