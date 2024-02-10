import { LOAD_ORDERS } from "../actionTypes/orderActionType"

/**
 * 
 * @param {*} payload = Order Data
 * @returns  Cart
 */
export const loadOrderToStore = (payload) =>{
    console.log("Add To Order",payload)
    return {
        type:LOAD_ORDERS,
        payload:payload
    }
}