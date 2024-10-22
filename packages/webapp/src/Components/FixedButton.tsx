import {Button, ButtonProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {FC} from "react";

const FixedButton: FC<Omit<ButtonProps, "type" | "style" | "icon">> = ({children, ...rest}) => {
    return (
        <Button
            type={"primary"}
            style={{
                position: "fixed",
                bottom: "16px",
                width: "calc(100% - 32px)",
                left: "16px",
            }}
            icon={<PlusOutlined/>}
            {...rest}
        >
            {children ?? "Create New"}
        </Button>
    );
};

export {FixedButton};
