import { REDUX_CONST } from "../../constants/reduxConstants";

const initialState = {
    dataState: false,
    data: null,
}

const SearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case REDUX_CONST.SEARCH_SN: {
            return {
                dataState: action.payload.dataState,
                data: action.payload.data,
            }
        }

        case REDUX_CONST.DIS_SEARCH_SN: {
            return initialState;
        }
        default:
            return state;
    }
}

export default SearchReducer;