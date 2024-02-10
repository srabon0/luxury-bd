import axios from "axios"
import { loadCurrentUser } from "../actions/userAction";

const loadUserInfo = (email)=>{
    return async(dispatch,getState)=>{
        const url = `https://fruit-mart-server.onrender.com/api/v1/users/current/${email}`
        const {data} = await axios.get(url);
        console.log(data.userdata)
        if(data){
            dispatch(loadCurrentUser(data.userdata))
        }
    }
}

export default loadUserInfo