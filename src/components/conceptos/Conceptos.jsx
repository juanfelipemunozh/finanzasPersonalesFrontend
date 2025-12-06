import { useEffect, useState } from 'react'
import './conceptos.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import ModalAgregarConcepto from './ModalAgregarConcepto'
import ModalEditarConcepto from './ModalEditarConcepto'
import Paginacion from '../../helpers/Paginacion'
import { BACKEND_URL } from '../../config/url'
import {LoadingData} from '../../helpers/LoadingData'

const Conceptos = () => {

    const [conceptos, setConceptos] = useState([])
    const [modalOpenEdit, setModalOpenEditar] = useState(false);
    const [modalOpenAgregar, setModalOpenAgregar] = useState(false)
    const [conceptoId, setConceptoId] = useState(null)

    useEffect(() => {
        obtenerConceptos();
    }, [])

    const obtenerConceptos = async () => {
        const token = localStorage.getItem('token');

        try {
            const { data } = await axios.get(`${BACKEND_URL}/api/concepto/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConceptos(data)
        } catch (error) {
            console.log(error);
        }
    }

    // Manejo de la ventana modal


    const handleOpenModalEditar = (id) => {
        setConceptoId(id);
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


    const eliminarConcepto = async (id) => {
        const token = localStorage.getItem('token');

        try {
            await axios.delete(`${BACKEND_URL}/api/concepto/${id}`, {
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
                    await eliminarConcepto(id);
                    Swal.fire(
                        'Eliminar!',
                        'Informacion eliminada.',
                        'Salir'
                    )
                    obtenerConceptos();
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

    const invertirDatos = [...conceptos].reverse();

    const paginacionData = invertirDatos.slice((paginaActual - 1) * itemPorPagina, paginaActual * itemPorPagina);

    const totalPaginas = Math.ceil(conceptos.length / itemPorPagina);

    const handleCambioPagina = (pagina) => {
        setPaginaActual(pagina)
    }

    return (
        <>
            <div className="contenedor-ingreso">
                <div className="ingreso">
                    <div className="ingreso_titulo"></div>
                    <div className="ingreso_valor" id="presupuestoTotal">
                    </div>
                </div>
            </div>

            <div className="contenedor-gastos-fijos">
                <h2 className="titulo-gasto-fijo">CONCEPTOS</h2>
                <button onClick={() => handleOpenModalAgregar()} className="btn-agregar">Agregar</button>
                <ModalAgregarConcepto isOpen={modalOpenAgregar} onClose={handleCloseModalAgregar} />
                <table className="tabla-gastos-fijos">
                    <thead>
                        <tr className="titlo-gastos-fijos">
                            <th className="contenido-gastos-fijos" scope="col">Concepto</th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                            <th className="contenido-gastos-fijos" scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {conceptos != 0 ? (paginacionData.map((concepto) => (
                            <tr key={concepto.UUID}>
                                <td >{concepto.concepto}</td>
                                <td>
                                    <button onClick={() => handleOpenModalEditar(concepto.UUID)} className="btn-editar">
                                        Editar
                                    </button>
                                    <ModalEditarConcepto isOpen={modalOpenEdit} onClose={handleCloseModalEditar} conceptoId={conceptoId} />
                                </td>
                                <td>
                                    <button className="btn-eliminar" onClick={() => handleClick(concepto.UUID)}>Eliminar</button>
                                </td>
                            </tr>
                        )))
                            :
                            (<div style={{ padding: "25px 0 0 50px" }}>
                                <LoadingData />
                            </div>
                            )
                        }
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
        </>
    )
}

export default Conceptos