import axios from "axios";
import { useEffect, useState } from "react";

const useAdmin = (user) => {
  const [admin, setAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  useEffect(() => {
    console.log("User email to check is admin or nt", user?.email)
    const email = user?.email;
    if (email) {
        const url = `https://fruit-mart-server.onrender.com/api/v1/users/admin/${email}`
       
        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          };
        const isAdmin = async() =>{
            
                const {data} = await axios.get(url,{headers:headers});
                await setAdmin(data.isAdmin);
                await setAdminLoading(false)
                console.log(data.isAdmin);
        }
        isAdmin();

     
    }
  }, [user]);
  return [admin, adminLoading];
};

export default useAdmin;