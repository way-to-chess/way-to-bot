import { z } from "zod";
import { ClientSchemaUserBase } from "@way-to-bot/shared/api/zod/client/user.schema.js";

import { EParticipateRequestPaymentType } from "../../../enums/EParticipateRequestPaymentType.js";

const ClientSchemaParticipateRequestAdditionalUserSchema = z
  .object({
    ...ClientSchemaUserBase,
    birthDate: z.coerce.date(),
    email: z.string().optional(),
  })
  .catchall(z.any());

export const baseShape = {
  eventId: z.number(),
  fileId: z.number().optional(),
  additionalUsers: z.array(ClientSchemaParticipateRequestAdditionalUserSchema),
  paymentType: z.nativeEnum(EParticipateRequestPaymentType),
};

export const validateFileIdForReceipt = (schema: z.ZodObject<any>) =>
  schema.refine(
    (data) =>
      !(
        data.paymentType === EParticipateRequestPaymentType.RECEIPT &&
        !data.fileId
      ),
    {
      message: "fileId is required when paymentType is RECEIPT",
      path: ["fileId"],
    },
  );

export const ClientSchemaParticipateRequestBase = validateFileIdForReceipt(
  z.object(baseShape),
);
