
export const change_userInfo = "changeUserInfo"

export function ChangeUserInfo(data) {
    return {
        type: change_userInfo,
        data: data
    }
}