import axios from 'axios';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import '../paginaPrincipal/modaleditargasto.css';
import { BACKEND_URL } from '../../config/url';


const ModalEditarIngreso = ({ isOpen, onClose, ingresoId }) => {

    const [ingresoData, setIngresoData] = useState(null);
    const [valor, setValor] = useState(0);
    const [concepto, setConcepto] = useState("");
    const [fecha, setFecha] = useState("");

    const [conceptos, setConceptos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token')

        const obtenerConceptos = async () => {
            const { data } = await axios.get(`${BACKEND_URL}/api/concepto/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setConceptos(data)
        }
        obtenerConceptos();
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token');

        const buscarIngreso = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/ingreso/${ingresoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIngresoData(data);
                setValor(data.valor);
                setConcepto(data.concepto);
                setFecha(data.fecha)
            } catch (error) {
                console.error('Error al buscar el objeto:', error);
            }
        }

        if (isOpen && ingresoId) {
            buscarIngreso()
        }
    }, [isOpen, ingresoId])

    const handleValorChange = (event) => {
        setValor(event.target.value)
    }

    const handleConceptoChange = (event) => {
        setConcepto(event.target.value)
    }

    const handleFechaChange = (event) => {
        setFecha(event.target.value)
    }

    const handleModificar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.put(`${BACKEND_URL}/api/ingreso/${ingresoId}`, {
                valor: valor,
                concepto: concepto,
                fecha: fecha
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            console.log(error);
        }
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-form">
                <div className="modal-content-form">
                    <button className="close-button-form" onClick={onClose}>
                        <IoCloseCircleOutline />
                    </button>
                    {ingresoData ? (

                        <form 
                        className="form-gastoEdit"
                        onSubmit={handleModificar}>
                            <label htmlFor="valor">Valor</label>
                            <input
                                className="form-item"
                                type="number"
                                id="valor"
                                value={valor}
                                onChange={handleValorChange}
                            />
                            <label htmlFor="concepto">Concepto</label>
                            <select onChange={handleConceptoChange} value={concepto}>
                                {
                                    conceptos.map((concepto) => (
                                        <option key={concepto.UUID}>{concepto.concepto}</option>
                                    ))
                                }
                            </select>
                            <label htmlFor="fecha">Fecha</label>
                            <input
                                className="form-item"
                                type="date"
                                id="fecha"
                                value={fecha}
                                onChange={handleFechaChange}
                            />
                            <input type='submit' className="btn-guardar" value={"Modificar"} />
                        </form>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalEditarIngreso