import { useEffect } from "react";
import Login from "../../components/usuario/Login"
import { BACKEND_URL } from "../../config/url";
import { json, useParams } from "react-router-dom";
import axios from "axios";


const LoginUsuario = () => {

  const params = useParams();
  const { id } = params;
  let token = id;

  useEffect(() => {

    if(!token) return;

    const confirmacionCuenta = async () => {

      try {
        const res = await axios.get(`${BACKEND_URL}/api/auth/${token}`);
        console.log("Cuenta confirmada:", res.data.msg);
      } catch (error) {
        json.status(400).json({ msg: error.message });

      }
    }
    confirmacionCuenta();
  }, [token]);


  return (
    <Login />
  )
}

export default LoginUsuario