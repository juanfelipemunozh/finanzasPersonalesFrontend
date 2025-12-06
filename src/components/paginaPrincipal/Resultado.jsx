import { useEffect } from "react"
import "./resultado.css"
import { useState } from "react"
import axios from "axios"
import ModalGasto from "../paginaPrincipal/ModalGasto"
import Swal from "sweetalert2"
import ModalEditarGasto from "../paginaPrincipal/ModalEditarGasto"
import ModalAgregarGasto from "../paginaPrincipal/ModalAgregarGasto"
import { formatearMoneda } from "../../helpers/formatoMoneda"
import GraficoPagPrinc from "../grafico/GraficoPagPrinc"
import Paginacion from "../../helpers/Paginacion"
import { BACKEND_URL } from "../../config/url"
import {Spinner} from "../../helpers/Spinner"
import {LoadingData} from "../../helpers/LoadingData"

const Resultado = () => {

    const [resultado, setResultado] = useState(0);
    const [gastosFijos, setGastosFijos] = useState([])
    const [modalOpenEdit, setModalOpenEdit] = useState(false);
    const [modalOpenDetalle, setModalOpenDetalle] = useState(false);
    const [modalOpenAgregar, setModalOpenAgregar] = useState(false);
    const [gastoId, setGastoId] = useState(null);

    // Manejo de la ventana modal
    const handleOpenModalDetalle = (id) => {
        setGastoId(id)
        setModalOpenDetalle(true);
    };

    const handleCloseModalDetalle = () => {
        setModalOpenDetalle(false);
    };

    const handleOpenModalEditar = (id) => {
        setGastoId(id)
        setModalOpenEdit(true);
    };

    const handleCloseModalEditar = () => {
        setModalOpenEdit(false);
    };

    const handleOpenModalAgregar = () => {
        setModalOpenAgregar(true)
    }

    const handleCloseModalAgregar = () => {
        setModalOpenAgregar(false)
    }

    const obtenerDatos = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/resultado`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setResultado(data)
        } catch (error) {
            console.log(error);
        }
    }

    const gastosFijo = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/gastoFijo/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setGastosFijos(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        obtenerDatos();
        gastosFijo();
    }, [])

    const sumaGastosFijos = gastosFijos.reduce((total, gastosFijos)=> 
        total + gastosFijos.valor, 0)

    const eliminarGastoFijo = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${BACKEND_URL}/api/gastoFijo/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
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
                    await eliminarGastoFijo(id);
                    Swal.fire(
                        'Eliminar!',
                        'Informacion eliminada.',
                        'Salir'
                    )
                    gastosFijo();
                    obtenerDatos();
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

    const invertirDatos = [...gastosFijos].reverse();

    const paginacionData = invertirDatos.slice((paginaActual - 1) * itemPorPagina, paginaActual * itemPorPagina);

    const totalPaginas = Math.ceil(gastosFijos.length / itemPorPagina);

    const handleCambioPagina = (pagina) => {
        setPaginaActual(pagina)
    }

    return (
        <>
            <div className="contenedor-presupuesto">
                <div className="presupuesto">
                    <div className="presupuesto_titulo">Saldo Disponible:</div>
                    <div className="presupuesto_valor">
                        {resultado ? (
                            formatearMoneda(resultado)
                        ) : (
                            <Spinner />
                        )
                        }
                    </div>
                </div>
            </div>
            <div className="contenedor-gastos-fijos">
                <h2 className="titulo-gasto-fijo">TOTAL GASTOS FIJOS: {formatearMoneda(sumaGastosFijos)}</h2>
                <button onClick={() => handleOpenModalAgregar()} className="btn-agregar">Agregar</button>
                <ModalAgregarGasto isOpen={modalOpenAgregar} onClose={handleCloseModalAgregar} />


                <table className="tabla-gastos-fijos">
                    <thead>
                        <tr className="titlo-gastos-fijos">
                            <th className="contenido-gastos-fijos" scope="col">Valor</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Concepto</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Descripcion</th>
                            <th className="contenido-gastos-fijos ocultar" scope="col">Fecha</th>
                            <th className="contenido-gastos-fijos " scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastosFijos != 0 ? (
                            paginacionData.map((gasto) => (
                                <tr key={gasto.UUID}>
                                    <td>{formatearMoneda(gasto.valor)}</td>
                                    <td className="ocultar">{gasto.concepto}</td>
                                    <td className="ocultar">{gasto.observacion}</td>
                                    <td className="ocultar">{gasto.fecha}</td>
                                    <td>
                                        <button onClick={() => handleOpenModalEditar(gasto.UUID)} className="btn-editar">
                                            Editar
                                        </button>
                                        <ModalEditarGasto isOpen={modalOpenEdit} onClose={handleCloseModalEditar} gastoId={gastoId} />
                                    </td>
                                    <td>
                                        <button className="btn-eliminar" onClick={() => handleClick(gasto.UUID)}>Eliminar</button>
                                    </td>
                                    <td>
                                        <button onClick={() => handleOpenModalDetalle(gasto.UUID)} className="btn-detalle">
                                            Detalle
                                        </button>
                                        <ModalGasto isOpen={modalOpenDetalle} onClose={handleCloseModalDetalle}
                                            gastoId={gastoId} />
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
                <div className="grafico">
                    <GraficoPagPrinc />
                </div>
            </div>

        </>
    )
}



export default Resultado