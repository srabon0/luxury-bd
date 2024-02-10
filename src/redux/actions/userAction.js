import { RESET_CURRENT_USER, SET_CURRENT_USER } from "../actionTypes/userActionType"


/**
 * 
 * @param {*} payload = SET UP CURRENT USER
 * @returns  User
 */
export const  loadCurrentUser= (payload) =>{
    return {
        type:SET_CURRENT_USER,
        payload:payload
    }
}

export const resetCurrentUser = ()=>{
    return {
        type:RESET_CURRENT_USER
    }

}