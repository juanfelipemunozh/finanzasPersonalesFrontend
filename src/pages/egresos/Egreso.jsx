import { useDispatch, useSelector } from "react-redux"
import Layout from "../../Layout/Layout"
import Egresos from "../../components/egresos/Egresos"
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/authSlice";
import { useEffect } from "react";

const Egreso = () => {
      // Autenticacion
      const dispatch = useDispatch();
      const navigate = useNavigate();
  
      //const { isError } = useSelector((state)=>state.auth)
  
      
      useEffect(()=>{
        const checkToken = () => {
            //dispatch(authenticateToken());
            const token = localStorage.getItem('token');

            if(!token){
                dispatch(logoutUser());
                navigate("/")
            }
        }
        checkToken();  
      }, [dispatch, navigate]) 

  return (
    <Layout >
        <Egresos />
    </Layout>
  )
}

export default Egreso