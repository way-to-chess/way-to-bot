import { UserService } from "../services/user.service";
import {
  Body,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Queries,
  Query,
  Route,
  Tags,
} from "tsoa";
import {
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "../interfaces/user.interface";

@Route("/api/user")
@Tags("Users")
export class UserController {
  private userService = new UserService();

  @Get("/all")
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get("/getById/{id}")
  async getUserById(@Path() id: number) {
    return this.userService.getUserById(id);
  }

  @Get("/getByUserName/{username}")
  async getUserByUserName(@Path() username: string) {
    return this.userService.getUserByUserName(username);
  }

  @Get("/getUserByTgInfo")
  async getUserByTgInfo(@Query() tgId?: number, @Query() username?: string) {
    if (!tgId && !username) {
      throw new Error("Query params not found");
    }
    return this.userService.getUserByTgIdOrUsername({ tgId, username });
  }

  @Post("/create")
  async createUser(@Body() payload: IUserCreatePayload) {
    return this.userService.createUser(payload);
  }

  @Put("/update")
  async updateUser(@Body() payload: IUserUpdatePayload) {
    return this.userService.updateUser(payload);
  }

  @Delete("/delete")
  async deleteUser(@Body() payload: IUserDeletePayload) {
    return this.userService.deleteUser(payload);
  }

  @Post("/addId")
  async addIdToUser(@Body() payload: { username: string; tgId: number }) {
    return this.userService.addIdToUser(payload);
  }
}
