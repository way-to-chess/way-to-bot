import {Avatar, Flex, Typography} from "antd";
import {FC} from "react";
import {AdminDTOUserGetMany} from "@way-to-bot/shared/api/DTO/admin/user.DTO";
import {getUserFullName} from "@way-to-bot/shared/utils/GetUserFullName";
import {getPreviewSrc} from "@way-to-bot/shared/utils/GetPreviewSrc";

const UserOption: FC<Pick<AdminDTOUserGetMany, "firstName" | "lastName" | "username" | "photo">> =
    ({
         firstName,
         lastName,
         username,
         photo
     }) => (
        <Flex align={"center"} gap={8}>
            <Avatar src={getPreviewSrc(photo?.previewUrl)} size={"large"}/>
            <Flex vertical>
                <Typography.Text strong>
                    {getUserFullName(firstName, lastName)}
                </Typography.Text>
                <Typography>
                    {username}
                </Typography>
            </Flex>
        </Flex>
    )

export {UserOption}