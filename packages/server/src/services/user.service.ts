import {
  IUserCreatePayload,
  IUserUpdatePayload,
} from "@interfaces/user.interface";
import { dbInstance } from "../database/init";
import { User } from "../database/entities/user.entity";
import { File } from "../database/entities/file.entity";

export class UserService {
  createUser = async (user: IUserCreatePayload) => {
    const userRepository = dbInstance.getRepository(User);
    const fileRepository = dbInstance.getRepository(File);

    const newUser = userRepository.create(user);
    if (user.photoId) {
      const photo = await fileRepository.findOneBy({ id: user.photoId });
      if (!photo) {
        throw new Error("Photo not found");
      }
      newUser.photo = photo;
    } else if (user.photoId === null) {
      newUser.photo = null;
    }
    return userRepository.save(newUser);
  };

  updateUser = async (user: IUserUpdatePayload) => {
    const userRepository = dbInstance.getRepository(User);
    const fileRepository = dbInstance.getRepository(File);

    const existingUser = await userRepository.findOneBy({ id: user.id });

    if (!existingUser) {
      throw new Error("User not found");
    }

    if (user.photoId) {
      const photo = await fileRepository.findOneBy({ id: user.photoId });
      if (!photo) {
        throw new Error("Photo not found");
      }
      existingUser.photo = photo;
    } else if (user.photoId === null) {
      existingUser.photo = null;
    }

    const updatedUser = userRepository.merge(existingUser, user);

    return userRepository.save(updatedUser);
  };

  deleteUser = async (id: number) => {
    const userRepository = dbInstance.getRepository(User);
    const existingUser = await userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const userDeleted = await userRepository.delete(id);

    return userDeleted.affected === 1;
  };
}
