import { loadCategory } from "../actions/categoryAction";
import apiInstance from "../../plugins/axiosIns";


const fetchCategories = ()=>{
    return async(dispatch,getState)=>{
        const url = "/backend/category/all"
        const {data} = await apiInstance.get(url);
        console.log(data?.data?.categories)
        if(data){
            dispatch(loadCategory(data?.data?.categories))
        }
    }
}

export default fetchCategories