import { REDUX_CONST } from "../../constants/reduxConstants"



const SearchSN = (data) => {
    return ({
        type: REDUX_CONST.SEARCH_SN,
        payload: {
            dataState: true,
            data: data,
        }
    })
}


const DisableSearchSN = () => {
    return ({
        type: REDUX_CONST.DIS_SEARCH_SN,
    })
}


export { SearchSN, DisableSearchSN }