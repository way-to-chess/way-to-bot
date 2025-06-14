import { z } from "zod";
import {
  baseShape,
  validateFileIdForReceipt,
} from "@way-to-bot/shared/api/zod/common/base/participate-request.schema.js";

export const ClientSchemaParticipateRequestCreate = validateFileIdForReceipt(
  z.object(baseShape).strict(),
);

export type TClientParticipateRequestCreatePayload = z.infer<
  typeof ClientSchemaParticipateRequestCreate
>;
