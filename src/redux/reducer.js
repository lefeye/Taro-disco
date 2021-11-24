const OU = "user"
const JU = "competition_manager"
const AU = "admin"

let defaultState = {
    userInfo: {
        email: "",
        status: false,//是否为登录状态
        typeofUser: OU//用户类型，默认下为普通用户
    }
}

export default (state = defaultState, actions) => {
    switch (actions.type) {
        case 'change_userInfo':
            return { ...state, userInfo: JSON.parse(JSON.stringify(actions.data)) }
        case 'clear_userInfo':
            return defaultState
        default:
        // return state
    }
    console.log(actions)
    return state;
}