const OU = "user"
// const JU = "competition_manager"
// const AU = "admin"

let defaultState = {
    userInfo: {
        account: "",
        status: false,/*sessionStorage.getItem('status') ? sessionStorage.getItem('status') : *///是否为登录状态
        typeofUser: OU/*sessionStorage.getItem('role') !== OU ? sessionStorage.getItem('role') : *///用户类型，默认下为普通用户
    }
}

export default (state = defaultState, actions) => {
    switch (actions.type) {
        case 'change_userInfo': {
            return { ...state, userInfo: JSON.parse(JSON.stringify(actions.data)) }
        }

        case 'clear_userInfo':
            return defaultState
        default:
        // return state
    }
    return state;
}