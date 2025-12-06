import { useEffect, useState } from 'react'
import './ingresos.css'
import axios from 'axios'
import ModalIngreso from './ModalIngreso'
import ModalEditarIngreso from './ModalEditarIngreso'
import ModalAgregarIngreso from './ModalAgregarIngreso'
import Swal from 'sweetalert2'
import { formatearMoneda } from '../../helpers/formatoMoneda'
import GraficoIngresos from '../grafico/GraficoIngresos'
import Paginacion from '../../helpers/Paginacion'
import { BACKEND_URL } from '../../config/url'
import { Spinner } from '../../helpers/Spinner'
import { LoadingData } from '../../helpers/LoadingData'

const Ingresos = () => {

    const [ingresos, setIngresos] = useState([])
    const [modalOpenDetalle, setModalOpenDetalle] = useState(false);
    const [modalOpenEdit, setModalOpenEditar] = useState(false);
    const [modalOpenAgregar, setModalOpenAgregar] = useState(false)
    const [ingresoId, setIngresoId] = useState(null)

    const obtenerIngresos = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/ingreso/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIngresos(data)
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(() => {
        obtenerIngresos();
    }, [])


    // calcular suma de ingresos en la base de datos
    const totalIngresos = ingresos.reduce((total, ingreso) =>
        total + ingreso.valor, 0)

    // Manejo de la ventana modal
    const handleOpenModalDetalle = (id) => {
        setIngresoId(id)
        setModalOpenDetalle(true);
    };

    const handleCloseModalDetalle = () => {
        setModalOpenDetalle(false);
    };

    const handleOpenModalEditar = (id) => {
        setIngresoId(id);
        setModalOpenEditar(true)
    }

    const handleCloseModalEditar = () => {
        setModalOpenEditar(false)
    }

    const handleOpenModalAgregar = () => {
        setModalOpenAgregar(true)
    }

    const handleCloseModalAgregar = () => {
        setModalOpenAgregar(false)
    }


    const eliminarIngreso = async (id) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${BACKEND_URL}/api/ingreso/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.log(error);
        }
    }

    const handleClick = async (id) => {
        Swal.fire({
            title: 'Desea eliminarlo?',
            text: "Se perdera la informacion!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await eliminarIngreso(id);
                    Swal.fire(
                        'Eliminar!',
                        'Informacion eliminada.',
                        'Salir'
                    )
                    obtenerIngresos();
                }
                catch (error) {
                    console.log(error);
                    Swal.fire(
                        'Error',
                        'Se produjo un error al eliminar la información.',
                        'error'
                    )
                }
            }
        })
    }

    // Generar Paginación de la página
    const [paginaActual, setPaginaActual] = useState(1);
    const itemPorPagina = 8;

    const invertirDatos = [...ingresos].reverse();

    const paginacionData = invertirDatos.slice((paginaActual - 1) * itemPorPagina, paginaActual * itemPorPagina);

    const totalPaginas = Math.ceil(ingresos.length / itemPorPagina);

    const handleCambioPagina = (pagina) => {
        setPaginaActual(pagina)
    }



    return (
        <>
            <div className="contenedor-ingreso">
                <div className="ingreso">
                    <div className="ingreso_titulo">Ingresos Totales:</div>
                    <div className="ingreso_valor" id="presupuestoTotal">
                        {
                            totalIngresos ? 
                            ( formatearMoneda(totalIngresos)) :
                            ( <Spinner />)
                        }
                    </div>
                </div>
            </div>

            <div className="contenedor-gastos-fijos">
                <h2 className="titulo-gasto-fijo">INGRESOS</h2>
                <button onClick={() => handleOpenModalAgregar()} className="btn-agregar">Agregar</button>
                <ModalAgregarIngreso isOpen={modalOpenAgregar} onClose={handleCloseModalAgregar} />
                <table className="tabla-gastos-fijos">
                    <thead>
                        <tr className="titlo-gastos-fijos">
                            <th className="contenido-gastos-fijos" scope="col">Valor</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Concepto</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Fecha</th>
                            <th className="contenido-gastos-fijos " scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { ingresos != 0 ?  (paginacionData.map((ingreso) => (
                            <tr key={ingreso.UUID}>
                                <td>{formatearMoneda(ingreso.valor)}</td>
                                <td className="ocultar">{ingreso.concepto}</td>
                                <td className="ocultar">{ingreso.fecha}</td>
                                <td>
                                    <button onClick={() => handleOpenModalEditar(ingreso.UUID)} className="btn-editar">
                                        Editar
                                    </button>
                                    <ModalEditarIngreso isOpen={modalOpenEdit} onClose={handleCloseModalEditar} ingresoId={ingresoId} />
                                </td>
                                <td>
                                    <button className="btn-eliminar" onClick={() => handleClick(ingreso.UUID)}>Eliminar</button>
                                </td>
                                <td>
                                    <button onClick={() => handleOpenModalDetalle(ingreso.UUID)} className="btn-detalle">
                                        Detalle
                                    </button>
                                    <ModalIngreso isOpen={modalOpenDetalle} onClose={handleCloseModalDetalle}
                                        ingresoId={ingresoId} />
                                </td>
                            </tr>
                        ))) : (
                            <div style={{ padding: "10px 0" }}>
                            <LoadingData />
                        </div>
                        )}
                    </tbody>
                </table>
                <div className="paginacion">
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        siguiente={handleCambioPagina}
                    />
                </div>
            </div>
            <div className="contenedor-grafico">
                <h2>Gráfico Control Ingresos</h2>
                <div className="grafico">
                    <GraficoIngresos />
                </div>
            </div>
        </>
    )
}

export default Ingresos