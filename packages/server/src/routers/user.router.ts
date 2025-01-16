import { Request, Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
  TUserGetByTgInfoQueryPayload,
} from "../interfaces/user.interface";
import { castUserNameMiddleware } from "../middlewares/username.mddwmts";

export const UserRouter = Router();
const userController = new UserController();

UserRouter.get("/all", async (req, res) => {
  const data = await userController.getAllUsers();
  res.status(200).json({ data });
});

UserRouter.get("/getById/:id", async (req: Request<{ id: number }>, res) => {
  if (!req.params?.id) {
    throw new Error("Param id is not found");
  }
  const data = await userController.getUserById(req.params.id);
  res.status(200).json({ data });
});

UserRouter.get(
  "/getByUserName/:username",
  castUserNameMiddleware,
  async (req: Request<{ username: string }>, res) => {
    if (!req.params?.username) {
      throw new Error("Param username is not found");
    }
    const data = await userController.getUserByUserName(req.params.username);
    res.status(200).json({ data });
  },
);

interface UserQuery {
  tgId: string; // ID пользователя в Telegram
  username: string; // Имя пользователя
}
UserRouter.get(
  "/getUserByTgInfo",
  castUserNameMiddleware,
  async (
    req: Request<{}, {}, {}, { username?: string; tgId?: string }>,
    res,
  ) => {
    const data = await userController.getUserByTgInfo(
      Number(req.query?.tgId),
      req.query?.username,
    );
    res.status(200).json({ data });
  },
);

UserRouter.post(
  "/create",
  async (req: Request<{}, {}, IUserCreatePayload>, res) => {
    const data = await userController.createUser(req.body);
    res.status(200).json({ data });
  },
);

UserRouter.put(
  "/update",
  async (req: Request<{}, {}, IUserUpdatePayload>, res) => {
    const data = await userController.updateUser(req.body);
    res.status(200).json({ data });
  },
);

UserRouter.delete(
  "/delete",
  async (req: Request<{}, {}, IUserDeletePayload>, res) => {
    const data = await userController.deleteUser(req.body);
    res.status(200).json({ data });
  },
);

UserRouter.post(
  "/addId",
  async (req: Request<{}, {}, { username: string; tgId: number }>, res) => {
    const data = await userController.addIdToUser(req.body);
    res.status(200).json({ data });
  },
);
