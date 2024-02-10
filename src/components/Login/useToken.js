import axios from "axios";
import { useEffect, useState } from "react";

const useToken = (user) => {
  const [token, setToken] = useState("");
  const email = user?.user?.email;
  const currentUser = JSON.stringify({ email: email });
  const headers = {
    "content-type": "application/json",
  };
  useEffect(() => {
    if (email) {
      const url = `https://fruit-mart-server.onrender.com/api/v1/users/validate`;
      axios.post(url, currentUser, { headers }).then((res) => {
        if(res.data){
          const token = res.data.token;
          localStorage.setItem("accessToken", token);
          setToken(token);
          console.log(res.data.currentuser)
        }
        
      });
    }
  }, [user]);
  return [token];
};

export default useToken;
