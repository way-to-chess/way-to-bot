import { type TUserController } from "../../../src/routers/user.router";

type TUser = Omit<
  Awaited<ReturnType<TUserController["getAllUsers"]>>[number],
  "calculateWinRateAndTotal"
>;

export type { TUser };
