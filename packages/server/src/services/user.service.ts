import {dbInstance} from "../database/init";
import {UserEntity} from "@way-to-bot/shared/entities/user.entity";
import {FileEntity} from "@way-to-bot/shared/entities/file.entity";
import {DeepPartial} from "typeorm";
import {IUserCreatePayload, IUserDeletePayload, IUserUpdatePayload} from "@way-to-bot/shared/interfaces/user.interface";

export class UserService {
    private userRepository = dbInstance.getRepository(UserEntity);

    getUserById = async (userId: number) => {
        const user = await this.userRepository.findOne({
            where: {id: userId},
            relations: {
                photo: true,
                eventsUsersLeagues: {
                    event: true,
                    league: true,
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
            where: {username},
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
            const photo = await fileRepository.findOneBy({id: user.fileId});
            if (!photo) {
                throw new Error(`File with id ${user.fileId} not found`);
            }
            newUser.photo = photo;
        }

        return this.userRepository.save(newUser);
    };

    updateUser = async (user: IUserUpdatePayload) => {
        const fileRepository = dbInstance.getRepository(FileEntity);

        const existingUser = await this.userRepository.findOneBy({id: user.id});

        if (!existingUser) {
            throw new Error(`User with id ${user.id} not found`);
        }

        if (user.fileId) {
            const photo = await fileRepository.findOneBy({id: user.fileId});
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
        const {userId} = payload;
        const existingUser = await this.userRepository.findOneBy({id: userId});

        if (!existingUser) {
            throw new Error(`User with id ${userId} not found`);
        }

        const userDeleted = await this.userRepository.delete(userId);

        return userDeleted.affected === 1;
    };
}
