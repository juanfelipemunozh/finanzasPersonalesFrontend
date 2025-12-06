import { useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BACKEND_URL } from '../../config/url';
import axios from 'axios';

const ModalAgregarConcepto = ({ isOpen, onClose }) => {

    const [concepto, setConcepto] = useState("");

    const handleConceptoChange = (event) => {
        setConcepto(event.target.value)
    }

    const handleGuardar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')

        try {
            await axios.post(`${BACKEND_URL}/api/concepto/nuevoConcepto`, {       
                concepto: concepto
            }, {
                headers: {
                    'Content-Type': 'application/json',
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
                        <IoCloseCircleOutline/>
                    </button>
                    <form 
                    className="form-gastoEdit" 
                    onSubmit={handleGuardar}>
                        <label htmlFor="concepto">Concepto</label>
                        <input
                            className="form-item"
                            type="text"
                            id="concepto"
                            onChange={handleConceptoChange}
                        />
                        <input type='submit' className="btn-guardar" value={"Guardar"}/>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ModalAgregarConcepto