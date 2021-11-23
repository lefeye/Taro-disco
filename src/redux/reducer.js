import { change_userInfo } from "./action"
import store from "./store"

const OU = "user"
const JU = "competition_manager"
const AU = "admin"

let storeState = {
    userInfo: {
        email: "",
        status: false,//是否为登录状态
        typeofUser: OU//用户类型，默认下为普通用户
    }
}

export default (state = storeState, actions) => {
    switch (actions.type) {
        case change_userInfo:
            return { ...state, userInfo: actions.data }
        default:
        // return state
    }
    return state;
}