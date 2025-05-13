import {FC, ReactNode} from "react";
import clsx from "clsx";
import classes from "./UserListItem.module.css";
import {ImgWithContainer} from "../ImgWithContainer/ImgWithContainer";
import {Typography} from "../Typography/Typography";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {generatePath, Link} from "react-router";
import {ClientDTOUserGetMany} from "@way-to-bot/shared/api/DTO/client/user.DTO";

interface IUserListItemProps extends ClientDTOUserGetMany {
    className?: string;
    prefix?: ReactNode;
}

const UserListItem: FC<IUserListItemProps> = (
    {
        id,
        firstName,
        lastName,
        username,
        photo,
        className,
        prefix,
        rating,
    }) => {
    const pathToUser = generatePath("/users/:id", {id: id.toString()});

    return (
        <Link to={pathToUser} className={clsx(classes.user, className)}>
            {prefix}

            <ImgWithContainer className={classes.userImg} previewUrl={photo?.url}/>
            <div className={classes.userInfo}>
                <Typography
                    type={"title5"}
                    value={getUserFullName(firstName, lastName)}
                />
                {!username || username.includes("wtb_test") ? "" : username}
            </div>
            <Typography type={"title4"} value={rating}/>
        </Link>
    );
};

export {UserListItem};
