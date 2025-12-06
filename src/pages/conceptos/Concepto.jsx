import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../Layout/Layout'
import Conceptos from '../../components/conceptos/Conceptos'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { logoutUser } from '../../features/authSlice';

const Concepto = () => {
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
      }, [ dispatch, navigate]) 

  return (    
    <Layout>
        <Conceptos />
    </Layout>
  )
}

export default Concepto