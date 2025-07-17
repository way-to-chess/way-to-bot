import {createContext, FC, PropsWithChildren, useContext, useState,} from "react";
import {Button, Drawer as AntDrawer, DrawerProps, Flex, Table as AntTable,} from "antd";
import {PlusIcon} from "lucide-react";
import {extractId} from "../../Utils/Extract";
import {useBoolean} from "@way-to-bot/shared/utils/UseBoolean";

type TDrawerContext = ReturnType<typeof useBoolean>;

const DrawerContext = createContext<TDrawerContext | null>(null);

const DrawerContextProvider: FC<PropsWithChildren> = ({children}) => {
    const value = useBoolean();

    return (
        <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
    );
};

const useDrawerContext = () => {
    const context = useContext(DrawerContext);

    if (!context) {
        throw new Error("Try to use Drawer context without provider");
    }

    return context;
};

const Drawer: FC<Omit<DrawerProps, "open" | "onClose" | "width">> = ({
                                                                         children,
                                                                         ...props
                                                                     }) => {
    const [open, {setFalse}] = useDrawerContext();

    return (
        <AntDrawer {...props} open={open} onClose={setFalse} width={720}>
            {children}
        </AntDrawer>
    );
};

const CreateButton = () => {
    const [_, {setTrue}] = useDrawerContext();

    return (
        <Button
            style={{width: "fit-content", alignSelf: "end"}}
            type={"primary"}
            onClick={setTrue}
            icon={<PlusIcon size={14}/>}
        >
            {"Создать"}
        </Button>
    );
};

const style = {width: "100%"};

const Table = () => {
    const [{isFetching, data}] = useState({
        isFetching: false,
        data: {data: []},
    });

    return (
        <AntTable
            style={style}
            rowKey={extractId}
            dataSource={data?.data}
            loading={isFetching}
            columns={[]}
            pagination={false}
        />
    );
};

const Page: FC<PropsWithChildren> = ({children}) => {
    return (
        <DrawerContextProvider>
            <Drawer title={"Создать новое событие"}>{children}</Drawer>
            <Flex vertical gap={8}>
                <CreateButton/>
                <Table/>
            </Flex>
        </DrawerContextProvider>
    );
};

export {Page};
