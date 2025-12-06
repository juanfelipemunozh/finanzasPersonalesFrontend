import axios from 'axios';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import '../paginaPrincipal/modaleditargasto.css';
import { BACKEND_URL } from '../../config/url';

const ModalAgregarIngreso = ({ isOpen, onClose }) => {
    const [valor, setValor] = useState(0);
    const [concepto, setConcepto] = useState("");
    const [fecha, setFecha] = useState("");

    const [conceptos, setConceptos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

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

    const handleValorChange = (event) => {
        setValor(event.target.value)
    }

    const handleConceptoChange = (event) => {
        setConcepto(event.target.value)
    }

    const handleFechaChange = (event) => {
        setFecha(event.target.value)
    }

    const handleGuardar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            await axios.post(`${BACKEND_URL}/api/ingreso/`, {
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
                    <form 
                    className="form-gastoEdit" 
                    onSubmit={handleGuardar}>
                        <label htmlFor="valor">Valor</label>
                        <input
                            className="form-item"
                            type="number"
                            id="valor"
                            onChange={handleValorChange}
                        />
                        <label htmlFor="concepto">Concepto</label>
                        <select onChange={handleConceptoChange}>
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
                            onChange={handleFechaChange}
                        />
                        <input type='submit' className="btn-guardar" value={"Guardar"}/>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ModalAgregarIngreso