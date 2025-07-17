import {Input} from "../../Input/Input";
import {Select} from "../../Select/Select";
import {IOption} from "../../Options/Options";

const LEVEL_OPTIONS: IOption<string>[] = [
    {
        title: "без разряда",
        value: "без разряда",

    },
    {
        title: "4 разряд",
        value: "4 разряд"
    },
    {
        title: "3 разряд",
        value: "3 разряд"
    },
    {
        title: "2 разряд",
        value: "2 разряд"
    },
    {
        title: "1 разряд",
        value: "1 разряд"
    },
    {
        title: "КМС",
        value: "КМС"
    },
    {
        title: "FM",
        value: "FM"
    },
    {
        title: "IM",
        value: "IM"
    },
    {
        title: "GM",
        value: "GM"
    }
]

const AdditionalFields = () => {


    return <>
        <Input placeholder={"Имя"}/>
        <Input placeholder={"Фамилия"}/>
        <Input placeholder={"Дата рождения"} type={"date"}/>
        <Select placeholder={"Спортивный разряд"} title={"Спортивный разряд"} options={LEVEL_OPTIONS}/>
        <Input placeholder={"Номер телефона"} type={"tel"}/>
    </>
}

export {AdditionalFields}