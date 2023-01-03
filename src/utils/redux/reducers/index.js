

import LoginReducer from "./Login";
import SearchReducer from "./SearchSN";
const { combineReducers } = require("redux");

const rootReducer = combineReducers({
    login: LoginReducer,
    search: SearchReducer,
})

export default rootReducer;