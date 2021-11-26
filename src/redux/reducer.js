const OU = "user"
const JU = "competition_manager"
const AU = "admin"

let defaultState = {
    userInfo: {
        email: "",
        //卧槽，试了一下sessionStorage为什么会出Bug
        status: localStorage.getItem('status')?localStorage.getItem('status'):false,//是否为登录状态
        typeofUser: localStorage.getItem('role')!==OU?localStorage.getItem('role'):OU//用户类型，默认下为普通用户
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