import {
  ComponentType,
  createElement,
  FC,
  Fragment,
  PropsWithChildren,
} from "react";
import { useAppSelector } from "../Hooks/UseAppSelector.ts";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice.ts";
import { Flex, Result, Skeleton } from "antd";
import { BackButton } from "./BackButton.tsx";
import { withProps } from "../Utils/WithProps.ts";
import {
  ERequestStatus,
  IWithRequestSymbol,
} from "../Store/RequestManager/RequestManagerModels.ts";

interface IWithBackButtonPath {
  backButtonPath?: string;
}

const BasePage: FC<PropsWithChildren & IWithBackButtonPath> = ({
  children,
  backButtonPath,
}) => {
  return (
    <Flex style={{ padding: 16 }} vertical gap={16}>
      <BackButton path={backButtonPath} />
      {children}
    </Flex>
  );
};

const Error: FC<IWithRequestSymbol & IWithBackButtonPath> = ({
  requestSymbol,
  backButtonPath,
}) => {
  const error = useAppSelector((state) =>
    requestManagerSlice.selectors.errorBySymbol(state, requestSymbol),
  );

  return (
    <BasePage backButtonPath={backButtonPath}>
      <Result
        title={"Something went wrong"}
        subTitle={error}
        status={"error"}
      />
    </BasePage>
  );
};

const Success: FC<IWithBackButtonPath> = ({ backButtonPath }) => {
  return (
    <BasePage backButtonPath={backButtonPath}>
      <Result status={"success"} title={"Success"} />
    </BasePage>
  );
};

interface IRequestStatusToComponentMap
  extends Record<
    Exclude<ERequestStatus, ERequestStatus.error | ERequestStatus.success>,
    ComponentType
  > {
  [ERequestStatus.error]: ComponentType<
    IWithRequestSymbol & IWithBackButtonPath
  >;
  [ERequestStatus.success]: ComponentType<IWithBackButtonPath>;
}

const REQUEST_STATUS_TO_COMPONENT_MAP: IRequestStatusToComponentMap = {
  [ERequestStatus.error]: Error,
  [ERequestStatus.success]: Success,
  [ERequestStatus.loading]: withProps(Skeleton)({ style: { padding: 16 } }),
  [ERequestStatus.idle]: Fragment,
};

type TRequestStatusToComponentProps = Partial<IRequestStatusToComponentMap> &
  IWithRequestSymbol &
  IWithBackButtonPath;

const RequestStatusToComponent: FC<TRequestStatusToComponentProps> = ({
  requestSymbol,
  backButtonPath,
  ERROR,
  ...rest
}) => {
  const status = useAppSelector((state) =>
    requestManagerSlice.selectors.statusBySymbol(state, requestSymbol),
  );

  if (status === ERequestStatus.error) {
    return createElement(
      ERROR ?? REQUEST_STATUS_TO_COMPONENT_MAP[ERequestStatus.error],
      { requestSymbol, backButtonPath },
    );
  }

  if (status === ERequestStatus.success) {
    return createElement(
      rest[status] ?? REQUEST_STATUS_TO_COMPONENT_MAP[status],
      { backButtonPath },
    );
  }

  return createElement(rest[status] ?? REQUEST_STATUS_TO_COMPONENT_MAP[status]);
};

export { RequestStatusToComponent };
