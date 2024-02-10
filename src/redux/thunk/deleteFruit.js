import axios from "axios";
import { deleteFruitFromStore } from "../actions/fruitAction";


const deleteFruit = (id)=>{
    return async(dispatch,getState)=>{
        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          };
          const url = `https://fruit-mart-server.onrender.com/api/v1/fruits/${id}`;
          const { data } = await axios.delete(url, { headers: headers });
          console.log("deleted ",data)
        if(data.operation.deletedCount){
            dispatch(deleteFruitFromStore(id))
        }
    }
}

export default deleteFruit