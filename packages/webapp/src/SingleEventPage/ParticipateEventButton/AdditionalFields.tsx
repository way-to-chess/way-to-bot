import {IOption} from "../../Options/Options";
import {TextField} from "../../Field/Field";
import {EEventType} from "@way-to-bot/shared/api/enums/EEventType";
import {FC} from "react";
import {ClientDTOEventGetOne} from "@way-to-bot/shared/api/DTO/client/event.DTO";

const LEVELS = ["Без разряда", "4 разряд", "3 разряд", "2 разряд", "1 разряд", "КМС", "FM", "IM", "GM"] as const

const LEVEL_OPTIONS: IOption<string>[] = LEVELS.map((level) => ({title: level, value: level}))

const VALIDATION_EXTENSION = {
    // phoneNumber: z.templateLiteral([z.enum(["25", "29", "33", "44"]), z.string().length(7)]),
    // level: z.enum(LEVELS),
}

const AdditionalFields: FC<Partial<Pick<ClientDTOEventGetOne, "type">>> = ({type}) => {

    if (type === EEventType.CHESS) {
        return <>
            <TextField label={"Имя"} inputProps={{placeholder: "Введите ваше имя", type: "text", enterKeyHint: "next"}}
                       controllerProps={{name: "additionalUsers[0].firstName"}} required/>
            <TextField label={"Фамилия"}
                       inputProps={{placeholder: "Введите вашу фамилию", type: "text", enterKeyHint: "next"}}
                       controllerProps={{name: "additionalUsers[0].lastName"}} required/>
            {/*<TextField label={"Дата рождения"}*/}
            {/*           inputProps={{*/}
            {/*               placeholder: "Введите дату рождения",*/}
            {/*               type: "date",*/}
            {/*               min: "1900-01-01",*/}
            {/*               enterKeyHint: "next"*/}
            {/*           }}*/}
            {/*           controllerProps={{name: "additionalUsers[0].birthDate"}} required/>*/}
            {/*<TextField label={"Город"}*/}
            {/*           inputProps={{placeholder: "Введите ваш город", enterKeyHint: "next"}}*/}
            {/*           controllerProps={{name: "additionalUsers[0].city"}}/>*/}
            {/*<TextField label={"Клуб"}*/}
            {/*           inputProps={{placeholder: "Ваш шахматный клуб", enterKeyHint: "next"}}*/}
            {/*           controllerProps={{name: "additionalUsers[0].club"}}/>*/}
            {/*<SelectField inputProps={{*/}
            {/*    options: LEVEL_OPTIONS,*/}
            {/*    placeholder: "Выберите из списка",*/}
            {/*    bottomSheetProps: {title: "Спортивный разряд"}*/}
            {/*}}*/}
            {/*             label={"Спортивный разряд"}*/}
            {/*             controllerProps={{name: "additionalUsers[0].level"}} required/>*/}
            {/*<TextField label={"FIDE ID (ecли есть)"}*/}
            {/*           inputProps={{placeholder: "Введите ID", type: "text", enterKeyHint: "next"}}*/}
            {/*           controllerProps={{name: "additionalUsers[0].fideId"}}/>*/}
            {/*<TextField label={"Номер телефона"}*/}
            {/*           inputProps={{placeholder: "Введите номер телефона", type: "tel", enterKeyHint: "next"}}*/}
            {/*           controllerProps={{name: "additionalUsers[0].phoneNumber"}}*/}
            {/*           description={"9 цифр номера телефона в формате: 29XXXXXXX, 33XXXXXXX, 25XXXXXXX, 44XXXXXXX"}*/}
            {/*           required/>*/}
        </>
    }

    return <>
        <TextField label={"Имя"} inputProps={{placeholder: "Введите ваше имя", type: "text", enterKeyHint: "next"}}
                   controllerProps={{name: "additionalUsers[0].firstName"}} required/>
        <TextField label={"Фамилия"}
                   inputProps={{placeholder: "Введите вашу фамилию", type: "text", enterKeyHint: "next"}}
                   controllerProps={{name: "additionalUsers[0].lastName"}} required/>
    </>

}

export {AdditionalFields, VALIDATION_EXTENSION}