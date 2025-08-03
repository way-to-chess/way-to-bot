import {Field} from "../../Field/Field";
import {eventApi} from "../../Store/Event/EventApi";
import {ChangeEventHandler, FC, MouseEventHandler} from "react";
import {Select} from "../../Select/Select";
import {useFormContext} from "react-hook-form";
import {XIcon} from "lucide-react";
import {ControllerProps} from "react-hook-form/dist/types/controller";

const NAME = "additionalUsers[0].elIds"

const EventLeaguesSelect: FC<{ eventId: string }> = ({eventId}) => {
    const {data: event} = eventApi.useGetEventByIdQuery(eventId);

    const form = useFormContext()

    const elIds: number[] = form.watch(NAME) || []

    const getOptions = (id?: number) => {
        //todo
        const eventLeagues = event?.eventLeagues.map((league, index) => ({...league, id: index})) || []
        const elIdsExceptValue = elIds.filter((elId) => elId !== id)

        const filtered = eventLeagues.filter(({name, id}) => !elIdsExceptValue.includes(id) && name !== "DEFAULT")

        return filtered.map(({name, id}) => ({
            value: String(id),
            title: name,
        }))
    }

    const getOnChange = (index: number): ChangeEventHandler<HTMLSelectElement> => (event) => {
        form.setValue(NAME, elIds.slice(0, index).concat(Number(event.target.value)).concat(elIds.slice(index + 1)))
    }

    const extra = new Array(elIds.length).fill(null)

    const getOnClick = (id?: number): MouseEventHandler<SVGSVGElement> => (event) => {
        event.stopPropagation()

        form.setValue(NAME, elIds.filter((it) => it !== id))
    }

    const render: ControllerProps["render"] = ({field: {ref}, fieldState: {invalid}}) => {


        return (
            <>
                <Select invalid={invalid} options={getOptions(elIds[0])} ref={ref} value={String(elIds[0])}
                        bottomSheetProps={{title: "Выберите турнир"}}
                        onChange={getOnChange(0)} placeholder={"Выберите турнир"}/>
                {extra.map((it, index) => <Select value={String(elIds[index + 1])}
                                                  options={getOptions(elIds[index + 1])}
                                                  onChange={getOnChange(index + 1)}
                                                  bottomSheetProps={{title: "Выберите турнир"}} key={index}
                                                  placeholder={"Выберите ещё, если необходимо"}
                                                  icon={elIds[index + 1] ?
                                                      <XIcon onClick={getOnClick(elIds[index + 1])}/> : null}
                />)}
            </>
        )
    }

    return <Field label={"Турнир"} description={"Можно участвовать в нескольких турнирах по одной заявке"} required
                  name={NAME} render={render}/>

}

export {EventLeaguesSelect}