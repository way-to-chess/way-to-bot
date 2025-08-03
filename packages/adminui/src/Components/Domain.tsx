import {createContext, FC, PropsWithChildren, ReactNode, useContext} from "react";
import {IDomain} from "../Domains/Domains";
import {IWithId} from "@way-to-bot/shared/interfaces/with.interface";
import {Space} from "antd";
import {EditButton} from "./Edit";
import {DeleteButton} from "./Delete";

const DomainContext = createContext<IDomain | null>(null)

const useDomainContext = () => {
    const context = useContext(DomainContext);

    if (!context) {
        throw new Error("Try to use Domain context without provider");
    }

    return context;
}

const getActionsColumn = (actions: ((it: IWithId) => ReactNode)[] = [], isEditAvailable?: boolean) => ({
    title: "Действия",
    width: 100,
    render: (props: IWithId) => (
        <Space.Compact>
            {...actions.map(action => action(props))}
            {isEditAvailable ? <EditButton id={props.id}/> : null}
            <DeleteButton id={props.id}/>
        </Space.Compact>
    ),
})

const DomainContextProvider: FC<PropsWithChildren & IDomain> = (
    {
        children,
        ...props
    }) => {

    const baseColumn = getActionsColumn(props.actions, props.edit.definition !== null)


    const value: IDomain = {
        ...props,
        columns: props.columns ? [...props.columns, baseColumn,] : [baseColumn]
    }


    return <DomainContext.Provider value={value}>
        {children}
    </DomainContext.Provider>
}

export {useDomainContext, DomainContextProvider}