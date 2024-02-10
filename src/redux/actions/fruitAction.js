import { LOAD_FRUITS, SET_TEST ,DELETE_FRUIT, ADD_TO_CART, REMOVE_FROM_CART, DECRESE_QUANTITY} from "../actionTypes/fruitActionType";

export const loadFruitInStore = (payload) =>{
    console.log("sending payload ", payload)
    return {
        type:LOAD_FRUITS,
        payload:payload
    }
}
export const deleteFruitFromStore = (payload) =>{
    console.log("deleteting", payload)
    return {
        type:DELETE_FRUIT,
        payload:payload
    }
}

export const test = (payload) =>{
    console.log("setting tresx")
    return {
        type:SET_TEST,
        payload:payload
    }
}

/**
 * 
 * @param {*} payload = FruitData 
 * @returns  Cart
 */
export const addToCart = (payload) =>{
    console.log("Add to cart",payload)
    return {
        type:ADD_TO_CART,
        payload:payload
    }
}

/**
 * 
 * @param {*} payload = FruitData 
 * @returns  Cart
 */
export const decreaseQty = (payload) =>{
    console.log("Decrease qty ",payload)
    return {
        type:DECRESE_QUANTITY,
        payload:payload
    }
}

/**
 * Remove Product From cart
 */

export const deleteFromCartStore =(fruitID)=>{
    console.log("Remove from Cart",fruitID)
    return {
        type:REMOVE_FROM_CART,
        payload:fruitID
    }
}