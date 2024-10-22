import { DeleteOutlined } from "@ant-design/icons";
import { useActionCreator } from "../Hooks/UseActionCreator.ts";
import { useConfirmAction } from "../Hooks/UseConfirmAction.ts";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { FC } from "react";

interface IDeleteButtonProps {
  actionCreator: ActionCreatorWithPayload<{ id: number }, string>;
  id: number;
  title: string;
}

const DeleteButton: FC<IDeleteButtonProps> = ({ actionCreator, id, title }) => {
  const deleteLocation = useActionCreator(actionCreator, {
    id,
  });

  const [contextHolder, onClick] = useConfirmAction(deleteLocation, title);

  return (
    <>
      <DeleteOutlined key="delete" onClick={onClick} />
      {contextHolder}
    </>
  );
};

export { DeleteButton };
