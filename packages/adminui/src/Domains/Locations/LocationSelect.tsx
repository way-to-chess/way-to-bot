import {Select, SelectProps} from "antd";
import {locationApi} from "../../Store/Location/LocationApi";
import {FC} from "react";

const LocationSelect: FC<Omit<SelectProps, "loading" | "options" | "placeholder">> = (props) => {
    const {isFetching, data: response,} = locationApi.useGetAllLocationsQuery({})

    const options = response?.data.map(({id, title}) => {
        return {
            value: id,
            label: title
        }
    })

    return <Select loading={isFetching} options={options} placeholder={"Выберите локацию"} {...props}/>
}

export {LocationSelect}