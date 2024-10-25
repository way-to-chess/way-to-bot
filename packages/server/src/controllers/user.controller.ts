import { UserService } from "../services/user.service";
import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import {
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
} from "packages/shared/src/interfaces/user.interface";

@Route("/api/user")
@Tags("User")
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
}
