import { ADD_TO_CART } from "../actionTypes/fruitActionType"

const cartCounter = (store)=>(next)=>(action)=>{
    const state = store.getState()
    const cart = state.fruitState.cart
    if(action.type===ADD_TO_CART){
        console.log("i am counting the cart position")
        const addPositionToCartItem = {
            ...action,
            payload:{...action.payload,cartPosition:cart.length}
        }
        return next(addPositionToCartItem)
    }
    return next(action)

}
export default cartCounter