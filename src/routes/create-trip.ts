import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { createTripSchema } from "../validators/trips/createTripSchema";
import { dayjs } from "../lib/formatDate";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from 'nodemailer';
import { formatDate } from "../lib/formatDate";
import { ClientError } from "../errors/client-error";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/trips', {
    schema: {
      body: createTripSchema
    }
  }, async (req) => {
    const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = req.body;

    if (dayjs(starts_at).isBefore(new Date())) {
      throw new ClientError("Date cannot be in the past");
    }

    if (dayjs(ends_at).isBefore(starts_at)) {
      throw new ClientError("End date must not be before the start date");
    }

    const mail = await getMailClient();

    const trip = await prisma.trip.create({
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
    });

    const confirmationLink = `http://localhost:3333/trips/${trip.id}/confirm`

    const formattedStartDate = formatDate(starts_at)
    const formattedEndDate = formatDate(ends_at)

    const message = await mail.sendMail({
      from: {
        name: "Equip Plann.er",
        address: "planner@anytech.co.mz"
      },
      to: {
        name: owner_name,
        address: owner_email
      },
      subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
      html: `
      <div style="font-family: sans-serif; font-size: 16px;line-height: 1.6;">
        <p>Voce solicitou a criacao de uma viagem para <strong>${destination}</strong> nas datas <strong>${formattedStartDate}</strong> ate <strong>${formattedEndDate}</strong> </p>
        <p></p>
        <p>Para confirmar a sua viagem, clique no link abaixo:</p>
        <p></p>
        <p>
          <a href="${confirmationLink}">Confirmar viagem</a>
        </p>
        <p></p>
        <p>Caso voce nao saiba do que se trata esse e-mail, apenas ignore esse e-mail</p>
      </div>
      `.trim()
    });

    console.log(nodemailer.getTestMessageUrl(message));

    return trip.id;
  });
}