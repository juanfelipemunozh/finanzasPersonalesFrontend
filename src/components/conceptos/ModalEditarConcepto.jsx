import axios from 'axios';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BACKEND_URL } from '../../config/url';

const ModalEditarConcepto = ({ isOpen, onClose, conceptoId }) => {

    const [concepto, setConcepto] = useState("");

    useEffect(() => {
        const buscarConcepto = async () => {
            const token = localStorage.getItem('token');

            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/concepto/${conceptoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setConcepto(data.concepto);

            } catch (error) {
                console.error('Error al buscar el objeto:', error);
            }
        }

        if (isOpen && conceptoId) {
            buscarConcepto()
        }
    }, [isOpen, conceptoId])

    const handleConceptoChange = (event) => {
        setConcepto(event.target.value)
    }

    const handleModificar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token')        

        try {
            await axios.put(`${BACKEND_URL}/api/concepto/${conceptoId}`, {
                concepto: concepto,
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
                    {concepto ? (
                        <form 
                        className="form-gastoEdit"
                        onSubmit={handleModificar}>
                            <label htmlFor="concepto">Concepto</label>
                            <input
                                className="form-item"
                                type="text"
                                id="concepto"
                                value={concepto}
                                onChange={handleConceptoChange}
                            />
                            <input type='submit' className="btn-guardar" value={"Modificar"}/>
                        </form>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalEditarConcepto