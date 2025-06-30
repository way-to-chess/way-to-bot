import { z } from "zod";

export const AdminSchemaTgSendCustomMessage = z.object({
  message: z.string(),
  userIds: z.array(z.number()).optional(),
  options: z
    .object({
      reply_markup: z.object({
        inline_keyboard: z.array(
          z.array(z.object({ text: z.string(), url: z.string() })),
        ),
      }),
    })
    .optional(),
});

export type TAdminTgSendCustomMessagePayload = z.infer<
  typeof AdminSchemaTgSendCustomMessage
>;
