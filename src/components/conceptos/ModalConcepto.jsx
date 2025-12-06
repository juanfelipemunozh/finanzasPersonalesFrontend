import axios from 'axios';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BACKEND_URL } from '../../config/url';

const ModalConcepto = ({ isOpen, onClose, conceptoId }) => {

    const [conceptoData, setConceptoData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const buscarConcepto = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/concepto/${conceptoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setConceptoData(data)
            } catch (error) {
                console.error('Error al buscar el objeto:', error);
            }
        };

        if (isOpen && conceptoId) {
            buscarConcepto()
        }

    }, [isOpen, conceptoId]);

    if (!isOpen) return null;


    return (
        <>
            <div className="modal">
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>
                        <IoCloseCircleOutline />
                    </button>
                    {conceptoData ? (
                        <div>
                            <p><span>Concepto:</span> {conceptoData.concepto}</p>
                        </div>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalConcepto