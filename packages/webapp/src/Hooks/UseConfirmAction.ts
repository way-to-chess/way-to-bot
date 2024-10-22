import { Modal } from "antd";
import { MouseEventHandler } from "react";

const useConfirmAction = (action: () => void, title: string) => {
  const [modal, contextHolder] = Modal.useModal();

  const onClick: MouseEventHandler<HTMLElement> = async (e) => {
    e.stopPropagation();

    const confirmed = await modal.confirm({
      maskClosable: true,
      title,
      centered: true,
      closable: true,
    });

    if (confirmed) {
      action();
    }
  };

  return [contextHolder, onClick] as const;
};

export { useConfirmAction };
