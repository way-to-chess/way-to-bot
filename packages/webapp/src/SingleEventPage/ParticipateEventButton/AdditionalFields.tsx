import {IOption} from "../../Options/Options";
import {SelectField, TextField} from "../../Field/Field";
import {z} from "zod";

const LEVELS = ["Без разряда", "4 разряд", "3 разряд", "2 разряд", "1 разряд", "КМС", "FM", "IM", "GM"] as const

const LEVEL_OPTIONS: IOption<string>[] = LEVELS.map((level) => ({title: level, value: level}))

const VALIDATION_EXTENSION = {
    phoneNumber: z.templateLiteral([z.enum(["25", "29", "33", "44"]), z.string().length(7)]),
    level: z.enum(LEVELS)
}

const AdditionalFields = () => {

    return <>
        <TextField label={"Имя"} inputProps={{placeholder: "Введите ваше имя", type: "text"}}
                   controllerProps={{name: "additionalUsers[0].firstName"}}/>
        <TextField label={"Фамилия"} inputProps={{placeholder: "Введите вашу фамилию", type: "text"}}
                   controllerProps={{name: "additionalUsers[0].lastName"}}/>
        <TextField label={"Дата рождения"} inputProps={{placeholder: "Введите дату рождения", type: "date"}}
                   controllerProps={{name: "additionalUsers[0].birthDate"}}/>
        <SelectField inputProps={{
            options: LEVEL_OPTIONS,
            placeholder: "Выберите из списка",
            bottomSheetProps: {title: "Спортивный разряд"}
        }}
                     label={"Спортивный разряд"}
                     controllerProps={{name: "additionalUsers[0].level"}}/>
        <TextField label={"Номер телефона"} inputProps={{placeholder: "Введите номер телефона", type: "tel"}}
                   controllerProps={{name: "additionalUsers[0].phoneNumber"}}
                   description={"9 цифр номера телефона в формате: 29XXXXXXX, 33XXXXXXX, 25XXXXXXX, 44XXXXXXX"}/>
    </>
}

export {AdditionalFields, VALIDATION_EXTENSION}