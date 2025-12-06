import axios from 'axios';
import './modaleditargasto.css';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from "react-icons/io5";
import { BACKEND_URL } from '../../config/url';


const ModalAgregarGasto = ({ isOpen, onClose }) => {
    const [valor, setValor] = useState(0);
    const [concepto, setConcepto] = useState("");
    const [observacion, setObservacion] = useState("");
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
        setValor(event.target.value);
    };

    const handleConceptoChange = (event) => {
        setConcepto(event.target.value);
    };

    const handleObservacionChange = (event) => {
        setObservacion(event.target.value)
    }

    const handleFechaChange = (event) => {
        setFecha(event.target.value)
    }

    const handleGuardar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        try {            
            await axios.post(`${BACKEND_URL}/api/gastoFijo/`, {
                concepto: concepto,
                valor: valor,
                observacion: observacion,
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
    };

    if (!isOpen) return null;


    return (
        <div className="modal-form">
            <div className="modal-content-form">
                <button className="close-button-form" onClick={onClose}>
                    <IoCloseCircleOutline />
                </button>
                <form 
                className="form-gastoEdit" 
                onSubmit={handleGuardar}>
                    <label>Valor</label>
                    <input
                        className="form-item"
                        type="number"                        
                        onChange={handleValorChange}
                    />
                    <label>Concepto</label>
                    <select onChange={handleConceptoChange} >
                        {
                            conceptos.map((concepto) => (
                                <option key={concepto.UUID} >{concepto.concepto}</option>
                            ))
                        }
                    </select>
                    <label>Observacion</label>
                    <input
                        className="form-item"
                        type="text"                        
                        onChange={handleObservacionChange}
                    />
                    <label>Fecha</label>
                    <input
                        className="form-item"
                        type="date"                        
                        onChange={handleFechaChange}
                    />
                    <input type='submit' className="btn-guardar" value={"Guardar"}/>
                </form>
            </div>
        </div>
    );
}

export default ModalAgregarGasto