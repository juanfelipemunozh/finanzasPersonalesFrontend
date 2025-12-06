import { Link, useNavigate } from 'react-router-dom'
import "./login.css";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, reset } from '../../features/authSlice';


const Login = () => {

    const [correo, setCorreo] = useState("")
    const [clave, setClave] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, isSuccess, isLoading, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user || isSuccess) {
            navigate("/paginaPrincipal")
        }

        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate])

    const handleCorreoChange = (event) =>{
        setCorreo(event.target.value)
    }

    const handleClaveChange = (event) => {
        setClave(event.target.value)
    }

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ correo, clave }))
    }

    return (
        <>
            <div className="background-login">
                <div className='container-login'>

                    <h1 className='titulo'><span>Control Financiero</span></h1>
                    <form
                        className='form-container'
                        onSubmit={Auth}
                    >
                        {
                            <p className='notificacion'>{message}</p>
                        }
                        <div className='mb-5'>
                            <label className='font-medium'>Correo Electrónico</label>
                            <input
                                type="email"
                                className='input-login'
                                placeholder='ej: correo@correo.com'
                                onChange={handleCorreoChange}
                            />
                        </div>
                        <div className='mb-5'>
                            <label className='font-medium'>Contraseña</label>
                            <input
                                type="password"
                                className='input-login'
                                placeholder='*********'
                                onChange={handleClaveChange}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-login">{isLoading ? "Cargando" : "Ingresar"}</button>
                        <div
                            className="login-options">
                            <Link to="/registro" className='login-option'>No tengo cuenta</Link>
                            <Link to="/olvide-password" className='login-option'>Olvide mi password</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login