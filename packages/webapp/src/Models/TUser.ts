import { type TUserController } from "../../../src/routers/user.router.ts";

type TUser = Omit<
  Awaited<ReturnType<TUserController["getAllUsers"]>>[number],
  "calculateWinRateAndTotal"
>;

export type { TUser };
