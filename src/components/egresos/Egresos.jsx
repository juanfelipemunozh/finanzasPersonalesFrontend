import { useEffect, useState } from 'react'
import './egresos.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import ModalAgregarEgreso from './ModalAgregarEgreso'
import ModalEditarEgreso from './ModalEditarEgreso'
import ModalEgreso from './ModalEgreso'
import { formatearMoneda } from '../../helpers/formatoMoneda'
import GraficoEgresos from '../grafico/GraficoEgresos'
import Paginacion from '../../helpers/Paginacion'
import { BACKEND_URL } from '../../config/url'
import {Spinner} from '../../helpers/Spinner'
import {LoadingData} from '../../helpers/LoadingData'


const Egresos = () => {

    const [egresos, setEgresos] = useState([])
    const [modalOpenDetalle, setModalOpenDetalle] = useState(false);
    const [modalOpenEdit, setModalOpenEditar] = useState(false);
    const [modalOpenAgregar, setModalOpenAgregar] = useState(false)
    const [egresoId, setEgresoId] = useState(null)

    useEffect(() => {
        obtenerEgresos();
    }, [])

    const obtenerEgresos = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/egreso/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setEgresos(data)
        } catch (error) {
            console.log(error);
        }
    }

    // calcular suma de ingresos en la base de datos
    const totalEgresos = egresos.reduce((total, egreso) =>
        total + egreso.valor, 0)

    // Manejo de la ventana modal
    const handleOpenModalDetalle = (id) => {
        setEgresoId(id)
        setModalOpenDetalle(true);
    };

    const handleCloseModalDetalle = () => {
        setModalOpenDetalle(false);
    };

    const handleOpenModalEditar = (id) => {
        setEgresoId(id);
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


    const eliminarEgreso = async (id) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${BACKEND_URL}/api/egreso/${id}`, {
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
                    await eliminarEgreso(id);
                    Swal.fire(
                        'Eliminar!',
                        'Informacion eliminada.',
                        'Salir'
                    )
                    obtenerEgresos();
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

    const invertirDatos = [...egresos].reverse();

    const paginacionData = invertirDatos.slice((paginaActual - 1) * itemPorPagina, paginaActual * itemPorPagina);

    const totalPaginas = Math.ceil(egresos.length / itemPorPagina);

    const handleCambioPagina = (pagina) => {
        setPaginaActual(pagina)
    }


    return (
        <>
            <div className="contenedor-ingreso">
                <div className="ingreso">
                    <div className="ingreso_titulo">Egresos Totales:</div>
                    <div className="ingreso_valor" id="presupuestoTotal">
                        {
                            totalEgresos ? (
                                formatearMoneda(totalEgresos)
                            ) : (
                                <Spinner />
                            )
                        }
                    </div>
                </div>
            </div>

            <div className="contenedor-gastos-fijos">
                <h2 className="titulo-gasto-fijo">EGRESOS</h2>
                <button onClick={() => handleOpenModalAgregar()} className="btn-agregar">Agregar</button>
                <ModalAgregarEgreso isOpen={modalOpenAgregar} onClose={handleCloseModalAgregar} />
                <table className="tabla-gastos-fijos">
                    <thead>
                        <tr className="titlo-gastos-fijos">
                            <th className="contenido-gastos-fijos" scope="col">Valor</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Concepto</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Observación</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Fecha</th>
                            <th className="contenido-gastos-fijos " scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {egresos != 0 ? (paginacionData.map((egreso) => (
                            <tr key={egreso.UUID}>
                                <td>{formatearMoneda(egreso.valor)}</td>
                                <td className="ocultar">{egreso.concepto}</td>
                                <td className="ocultar">{egreso.observacion}</td>
                                <td className="ocultar">{egreso.fecha}</td>
                                <td>
                                    <button onClick={() => handleOpenModalEditar(egreso.UUID)} className="btn-editar">
                                        Editar
                                    </button>
                                    <ModalEditarEgreso isOpen={modalOpenEdit} onClose={handleCloseModalEditar} egresoId={egresoId} />
                                </td>
                                <td>
                                    <button className="btn-eliminar" onClick={() => handleClick(egreso.UUID)}>Eliminar</button>
                                </td>
                                <td>
                                    <button onClick={() => handleOpenModalDetalle(egreso.UUID)} className="btn-detalle">
                                        Detalle
                                    </button>
                                    <ModalEgreso isOpen={modalOpenDetalle} onClose={handleCloseModalDetalle}
                                        egresoId={egresoId} />
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
                <h2>Gráfico Control Egresos</h2>
                <div className="grafico">
                    <GraficoEgresos />
                </div>
            </div>
        </>
    )
}

export default Egresos