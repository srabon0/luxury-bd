import axios from "axios"
import { loadOrderToStore } from "../actions/orderAction";

const loadAllOrders = ()=>{
    return async(dispatch,getState)=>{
        const url = "https://fruit-mart-server.onrender.com/api/v1/orders";
        const {data} = await axios.get(url);
        if(data){
            dispatch(loadOrderToStore(data.orders))
        }
    }
}

export default loadAllOrders