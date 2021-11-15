
export const change_user_info = "changeUserInfo"

export function ChangeUserInfo(data) {
    return {
        type: change_user_info,
        data: data
    }
}