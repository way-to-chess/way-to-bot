import { dbInstance } from "../database/init";
import { UserEntity } from "../database/entities/user.entity";
import { FileEntity } from "../database/entities/file.entity";
import {
  IUserCreatePayload,
  IUserDeletePayload,
  IUserUpdatePayload,
  TUserGetByTgInfoQueryPayload,
} from "../interfaces/user.interface";
import { DeepPartial, FindOptionsWhere } from "typeorm";

export class UserService {
  private userRepository = dbInstance.getRepository(UserEntity);

  getUserById = async (userId: number) => {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        photo: true,
        eventsUsersLeagues: {
          event: true,
          league: true,
        },
        participateRequests: {
          event: true,
          receipt: true,
        },
      },
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return user;
  };

  getUserByUserName = async (username: string) => {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: {
        photo: true,
        eventsUsersLeagues: {
          event: true,
          league: true,
        },
      },
    });

    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    return user;
  };

  getAllUsers = async () => {
    return this.userRepository.find({
      relations: {
        photo: true,
      },
    });
  };

  createUser = async (user: IUserCreatePayload) => {
    const fileRepository = dbInstance.getRepository(FileEntity);
    const newUser = this.userRepository.create(user as DeepPartial<UserEntity>);
    if (user.fileId) {
      const photo = await fileRepository.findOneBy({ id: user.fileId });
      if (!photo) {
        throw new Error(`File with id ${user.fileId} not found`);
      }
      newUser.photo = photo;
    }

    return this.userRepository.save(newUser);
  };

  updateUser = async (user: IUserUpdatePayload) => {
    const fileRepository = dbInstance.getRepository(FileEntity);

    const existingUser = await this.userRepository.findOneBy({ id: user.id });

    if (!existingUser) {
      throw new Error(`User with id ${user.id} not found`);
    }

    if (user.fileId) {
      const photo = await fileRepository.findOneBy({ id: user.fileId });
      if (!photo) {
        throw new Error(`File with id ${user.fileId} not found`);
      }
      existingUser.photo = photo;
    } else if (user.fileId === null) {
      existingUser.photo = null;
    }

    const updatedUser = this.userRepository.merge(
      existingUser,
      user as DeepPartial<UserEntity>,
    );

    return this.userRepository.save(updatedUser);
  };

  deleteUser = async (payload: IUserDeletePayload) => {
    const { userId } = payload;
    const existingUser = await this.userRepository.findOneBy({ id: userId });

    if (!existingUser) {
      throw new Error(`User with id ${userId} not found`);
    }

    const userDeleted = await this.userRepository.delete(userId);

    return userDeleted.affected === 1;
  };

  addIdToUser = async (payload: { username: string; tgId: number }) => {
    const { username, tgId } = payload;

    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    user.tgId = tgId;

    await this.userRepository.save(user);
    return true;
  };

  getUserByTgIdOrUsername = async (payload: TUserGetByTgInfoQueryPayload) => {
    const { username, tgId } = payload;

    const where: FindOptionsWhere<UserEntity>[] = [];

    if (tgId) {
      where.push({ tgId });
    }

    if (username) {
      where.push({ username: "@" + username });
    }

    const user = await this.userRepository.findOneBy(where);

    if (user && !user.tgId && tgId) {
      user.tgId = tgId;
      await this.userRepository.save(user);
    }

    if (!user) {
      throw new Error(
        `User with tgId "${tgId}" and username "${username}" not found`,
      );
    }

    return user;
  };
}
