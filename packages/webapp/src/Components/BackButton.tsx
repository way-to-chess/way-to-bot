import { Button, Flex } from "antd";
import { Link } from "react-router-dom";
import { FC } from "react";

interface IBackButton {
  path?: string;
}

const BackButton: FC<IBackButton> = ({ path }) => {
  return (
    <Flex justify={"flex-end"}>
      <Link to={path ?? ".."} relative={"path"}>
        <Button>{"Back"}</Button>
      </Link>
    </Flex>
  );
};
export { BackButton };
