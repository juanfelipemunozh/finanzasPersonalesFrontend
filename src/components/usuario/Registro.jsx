import { Link } from "react-router-dom"
import "./registro.css"
import { useState } from "react"
import Alerta from "../../components/Alerta"
import axios from "axios"


const Registro = () => {

    const [nombreCompleto, setNombreCompleto] = useState("");
    const [telefono, setTelefono] = useState(0);
    const [correo, setCorreo] = useState("");
    const [clave, setClave] = useState("");
    const [confirmarClave, setConfirmarClave] = useState("");


    const [alerta, setAlerta] = useState({});

    const handleSubmit = async (e) => {
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
            await axios.post('http://localhost:5000/api/usuario/',
                { nombreCompleto, telefono, correo, clave, confirmarClave })

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
                msg: error.response.msg,
                error: true
            })
        }
    };

    const { msg } = alerta;

    return (
        <>
            <div className='container-registro'>
                <div>
                    <h1 className='font-bold text-4xl uppercase text-center md:w-2/3 mx-auto'>Registrate al sistema de <span className='text-sky-500'>control financiero</span></h1>
                        {
                            msg && <Alerta 
                                alerta={alerta}
                            />
                        }
                    <form 
                    onSubmit={handleSubmit}
                    className='p-4 mx-auto w-96 sm:px-9 mt-8 shadow-md'>
                        <div className='mb-5'>
                            <label htmlFor="nombre" className='font-medium'>Nombre Completo</label>
                            <input 
                            type="text" 
                            id="nombre" 
                            className='block placeholder-slate-400 p-2 w-full bg-slate-100' 
                            placeholder='ej: Juan David Ariza Torres'
                            value={nombreCompleto}
                            onChange={ e => setNombreCompleto(e.target.value)} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="telefono" className='font-medium'>Telefono</label>
                            <input 
                            type="number" 
                            id="telefono" 
                            className='block placeholder-slate-400 p-2 w-full bg-slate-100' 
                            placeholder='ej: 300123456'
                            value={telefono}
                            onChange={ e => setTelefono(e.target.value)} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="email" className='font-medium'>Correo Electrónico</label>
                            <input 
                            type="email" 
                            id="email" 
                            className='block placeholder-slate-400 p-2 w-full bg-slate-100' 
                            placeholder='ej: correo@correo.com'
                            value={correo}
                            onChange={ e => setCorreo(e.target.value)} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="password" className='font-medium'>Contraseña</label>
                            <input 
                            type="password" 
                            id="password" 
                            className='block placeholder-slate-400 p-2 w-full bg-slate-100' 
                            placeholder='*********'
                            value={clave}
                            onChange={ e => setClave(e.target.value)} />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor="password" className='font-medium'>Confirmar Contraseña</label>
                            <input 
                            type="password" 
                            id="password" 
                            className='block placeholder-slate-400 p-2 w-full bg-slate-100' 
                            placeholder='*********'
                            value={confirmarClave}
                            onChange={ e=> setConfirmarClave(e.target.value)} />
                        </div>
                        <input type="submit" value="Ingresar" className='uppercase bg-sky-700 text-white p-2 rounded-md w-full' />
                        <div className='flex justify-between px-4 mt-5 text-slate-500 '>
                            <Link to="/" className=''>Ya tengo cuenta.</Link>
                            <Link to="/olvide-password">Olvide mi password.</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Registro