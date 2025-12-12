import { useDispatch } from "react-redux";
import Layout from "../Layout/Layout"
import Resultado from "../components/paginaPrincipal/Resultado"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logoutUser } from "../features/authSlice";

const PaginaPrincipal = () => {
      // Autenticacion
      const dispatch = useDispatch();
      const navigate = useNavigate();
  
      //const { isError } = useSelector((state)=>state.auth)
  
      // Verificación del token al cargar la página
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
    <Layout>
        <Resultado/>
    </Layout>
  )
}

export default PaginaPrincipal