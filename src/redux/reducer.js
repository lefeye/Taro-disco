import { change_user_info } from "./action"

const OU = "Ordinary_user"
const JU = "Judges"
const AU = "Administrators"

let storeState = {
    userInfo: {
        id: "",
        status: false,
        typeofUser: OU
    }
}

export default function Store(state = storeState, actions) {
    switch (actions.type) {
        case change_user_info:
            return { ...state, userInfo: actions.data }
        default:
            return state
    }
}