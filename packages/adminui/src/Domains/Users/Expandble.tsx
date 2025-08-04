import {AdminDTOUserGetMany} from "@way-to-bot/shared/api/DTO/admin/user.DTO";

const EXPANDABLE_CONFIG = {
    expandRowByClick: true,
    expandedRowRender: (user: AdminDTOUserGetMany) => <pre>{JSON.stringify(user, null, 2)}</pre>,
}

export {EXPANDABLE_CONFIG}