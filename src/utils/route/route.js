import { Redirect } from "react-router-dom";

const checkRole = (isLogin, isFirstTime) => {
    if (!isLogin) {
        if (!isFirstTime) {
            return <Redirect to='/login' />
        }
    }
}


export {checkRole};