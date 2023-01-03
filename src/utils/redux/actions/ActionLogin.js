import { REDUX_CONST } from "../../constants/reduxConstants"

const LoginSuccess = (authentication) => {
    return ({
        type: REDUX_CONST.LOGIN_SUCCESS,
        payload: {
            loginState: true,
            authentication: authentication,
            timestamp: new Date().getTime()
        }
    })
}

const Logout = () => {
    return ({
        type: REDUX_CONST.LOGOUT_SUCCESS,
    })
}





export { LoginSuccess, Logout}