import axios from 'axios';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { formatearMoneda } from '../../helpers/formatoMoneda';
import { BACKEND_URL } from '../../config/url';

const ModalIngreso = ({ isOpen, onClose, ingresoId }) => {

    const [ingresoData, setIngresoData] = useState(null);

    useEffect(() => {
        const buscarIngreso = async () => {
            const token = localStorage.getItem('token')

            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/ingreso/${ingresoId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIngresoData(data)
            } catch (error) {
                console.error('Error al buscar el objeto:', error);
            }
        };

        if (isOpen && ingresoId) {
            buscarIngreso()
        }

    }, [isOpen, ingresoId]);

    if (!isOpen) return null;


    return (
        <>
            <div className="modal">
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>
                        <IoCloseCircleOutline/>
                    </button>
                    {ingresoData ? (
                        <div>
                            <p><span>valor:</span> {formatearMoneda(ingresoData.valor)}</p>
                            <p><span>Concepto:</span> {ingresoData.concepto}</p>
                            <p><span>Fecha:</span> {ingresoData.fecha}</p>
                        </div>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalIngreso