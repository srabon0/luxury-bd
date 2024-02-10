import { LOAD_ORDERS } from "../actionTypes/orderActionType"

const initalState = {
    orders:[]
}

const orderReducer = (state=initalState,action)=>{
    switch(action.type){
        case LOAD_ORDERS:
            return {
                ...state,
                orders:action.payload
            }
        default:
            return state
    }

}

export default orderReducer