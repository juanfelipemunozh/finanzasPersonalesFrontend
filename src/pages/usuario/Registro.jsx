import { Link } from "react-router-dom"
import "./registro.css"
import { useState } from "react"
import Alerta from "../../components/Alerta"
import axios from "axios"
import { BACKEND_URL } from "../../config/url"


const Registro = () => {

    const [nombreCompleto, setNombreCompleto] = useState("");
    const [telefono, setTelefono] = useState(0);
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [confirmarClave, setConfirmarClave] = useState("");


    const [alerta, setAlerta] = useState({});


    const handleNombreChange = (event) => {
        setNombreCompleto(event.target.value)
    }

    const handleTelefonoChange = (event) => {
        setTelefono(event.target.value)
    }

    const handleCorreoChange = (event) => {
        setCorreo(event.target.value)
    }                               
    const handleClaveChange = (event) => {
        setClave(event.target.value)
    }

    const handleConfirmarClaveChange = (event) => {
        setConfirmarClave(event.target.value)
    }   



    const handleGuardar = async (e) => {
        e.preventDefault();

        if ([nombreCompleto, telefono, correo, clave, confirmarClave].includes("")) {
            setAlerta({ msg: "Hay campos vacios", error: true });
            return;
        }

        if (clave !== confirmarClave) {
            setAlerta({ msg: "Las contraseñas no coinciden", error: true });
            return;
        }

        if (clave.length < 7) {
            setAlerta({ msg: "Clave muy corta, agrega mínimo 6 caracteres", error: true });
            return;
        }

        setAlerta({});

        // Creando el usuario en la API
        try {
            await axios.post(`${BACKEND_URL}/api/usuario/registrar`,
                { nombreCompleto: nombreCompleto, 
                    telefono: telefono, 
                    correo: correo, 
                    clave: clave, 
                    confirmarClave: confirmarClave
                 })

            setAlerta({
                msg: "Creado correctamente, revisa tu email",
                error: false
            })

            setNombreCompleto("");
            setTelefono(0);
            setCorreo("");
            setClave("");
            setConfirmarClave("");

        } catch (error) {                       
            setAlerta({
                msg: "Usuario ya registrado",
                error: true

            })
        }
    };

    

    const { msg } = alerta;

    return (
        <>
            <div className='container-registro'>
                <div>
                    <h1 className='titulo-registro'>Registrate al sistema de <span className=''>control financiero</span></h1>
                    {
                        msg && <Alerta
                            alerta={alerta}
                        />
                    }
                    <form
                        onSubmit={handleGuardar}
                        className='form-container'>
                        <div className='mb-5'>
                            <label htmlFor="nombre" className='font-medium'>Nombre Completo</label>
                            <input
                                type="text"
                                id="nombre"
                                className='block placeholder-slate-400 p-2 w-full bg-slate-100'
                                placeholder='ej: Juan David Ariza Torres'                                
                                onChange={handleNombreChange} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="telefono" className='font-medium'>Telefono</label>
                            <input
                                type="number"
                                id="telefono"
                                className='block placeholder-slate-400 p-2 w-full bg-slate-100'
                                placeholder='ej: 300123456'                                
                                onChange={handleTelefonoChange} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="email" className='font-medium'>Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                className='block placeholder-slate-400 p-2 w-full bg-slate-100'
                                placeholder='ej: correo@correo.com'                                
                                onChange={handleCorreoChange} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="password" className='font-medium'>Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className='block placeholder-slate-400 p-2 w-full bg-slate-100'
                                placeholder='*********'                                
                                onChange={handleClaveChange} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="password" className='font-medium'>Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                className='block placeholder-slate-400 p-2 w-full bg-slate-100'
                                placeholder='*********'                            
                                onChange={handleConfirmarClaveChange} />
                        </div>
                        <input type="submit" value="Ingresar" className='uppercase bg-sky-700 text-white p-2 rounded-md w-full' />
                        <div className='login-options-registro'>
                            <Link to="/" className='login-option'>Ya tengo cuenta</Link>
                            <Link to="/olvide-password" className='login-option'>Olvide mi password</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Registro