import {IDomain} from "../Domains";
import {CreateMessage} from "./Create";
import {TAdminTgSendCustomMessagePayload} from "@way-to-bot/shared/api/zod/admin/tg.schema";

const MessagesDomain: IDomain<unknown, unknown, TAdminTgSendCustomMessagePayload, unknown> = {
    title: "Сообщения",
    path: "messages",
    url: "tg/message/custom",
    columns: [],
    options: {},
    create: {
        title: "Создать сообщение",
        definition: <CreateMessage/>,
        url: "tg/message/custom",
        normalize: (values) => (
            {
                message: values.message,
                userIds: values.userIds ?? [],
                options: {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[]],
                    },
                },
            }
        )
    },
    searchFields: [],
    edit: {
        title: "Изменить сообщение",
        definition: null,
        getInitialValues: () => ({}),
    },
}

export {MessagesDomain}