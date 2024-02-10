// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { deleteFruitFromStore } from "../actions/fruitAction";


// const createOrder = (orderData)=>{
//     return async(dispatch,getState)=>{
//         const headers = {
//             "Content-Type": "application/json",
//             authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//           };
//           const url = `https://fruit-mart-server.onrender.com/api/v1/orders/`;
//           const { data } = await axios.post(url, orderData, { headers: headers });
//           console.log("Order create ",data)
//           dispatch()
//         // if(data.operation.deletedCount){
//         //     dispatch(deleteFruitFromStore(id)
//         // }
//     }
// }

// export default createOrder