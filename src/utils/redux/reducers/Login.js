import { REDUX_CONST } from "../../constants/reduxConstants";

const initialState = {
    loginState: false,
    authentication: null,
}

const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case REDUX_CONST.LOGIN_SUCCESS: {
            return {
                loginState: action.payload.loginState,
                authentication: action.payload.authentication,
                timestamp: action.payload.timestamp
            }
        }
        case REDUX_CONST.LOGOUT_SUCCESS: {
            return initialState;
        }
        default:
            return state;
    }
}

export default LoginReducer;