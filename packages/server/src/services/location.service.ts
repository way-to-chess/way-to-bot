import {dbInstance} from "../database/init";
import {FileEntity} from "@way-to-bot/shared/entities/file.entity";
import {LocationEntity} from "@way-to-bot/shared/entities/location.entity";
import {DeepPartial} from "typeorm";
import {
  ILocationCreatePayload,
  ILocationDeletePayload,
  ILocationUpdatePayload
} from "@way-to-bot/shared/interfaces/location.interface";

export class LocationService {
    private locationRepository = dbInstance.getRepository(LocationEntity);

    getLocationById = async (locationId: number) => {
        const location = await this.locationRepository.findOne({
            where: {id: locationId},
            relations: {
                preview: true,
            },
        });

        if (!location) {
            throw new Error(`Location with id ${locationId} not found`);
        }

        return location;
    };

    getAllLocations = async () => {
        return this.locationRepository.find({
            relations: {
                preview: true,
            },
        });
    };

    createLocation = async (location: ILocationCreatePayload) => {
        const fileRepository = dbInstance.getRepository(FileEntity);

        const newLocation = this.locationRepository.create(
            location as DeepPartial<LocationEntity>,
        );
        if (location.fileId) {
            const preview = await fileRepository.findOneBy({id: location.fileId});
            if (!preview) {
                throw new Error(`File with id ${location.fileId} not found`);
            }
            newLocation.preview = preview;
        }

        return this.locationRepository.save(newLocation);
    };

    updateLocation = async (location: ILocationUpdatePayload) => {
        const fileRepository = dbInstance.getRepository(FileEntity);

        const existingLocation = await this.locationRepository.findOneBy({
            id: location.id!,
        });

        if (!existingLocation) {
            throw new Error(`Location with id ${location.id} not found`);
        }

        if (location.fileId) {
            const preview = await fileRepository.findOneBy({id: location.fileId});
            if (!preview) {
                throw new Error(`File with id ${location.fileId} not found`);
            }
            existingLocation.preview = preview;
        } else if (location.fileId === null) {
            existingLocation.preview = null;
        }

        const updatedLocation = this.locationRepository.merge(
            existingLocation,
            location as DeepPartial<LocationEntity>,
        );

        return this.locationRepository.save(updatedLocation);
    };

    deleteLocation = async (payload: ILocationDeletePayload) => {
        const {locationId} = payload;
        const existingLocation = await this.locationRepository.findOneBy({
            id: locationId,
        });

        if (!existingLocation) {
            throw new Error(`Location with id ${locationId} not found`);
        }

        const locationDeleted = await this.locationRepository.delete(locationId);

        return locationDeleted.affected === 1;
    };
}
