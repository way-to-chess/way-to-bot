import {FileEntity} from "@way-to-bot/shared/entities/file.entity";
import {setFileUrlForClient} from "@way-to-bot/shared/utils/setFileUrlForClient";

export class FileDTO {
    id: number;
    url: string;

    constructor(file: FileEntity) {
        this.id = file.id;
        this.url = setFileUrlForClient(file.url);
    }
}
