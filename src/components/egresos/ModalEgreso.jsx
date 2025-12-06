import axios from 'axios';
import { useEffect, useState } from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { formatearMoneda } from '../../helpers/formatoMoneda';
import { BACKEND_URL } from '../../config/url';

const ModalEgreso = ({ isOpen, onClose, egresoId }) => {

    const [egresoData, setEgresoData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const buscarIngreso = async () => {
            try {
                const { data } = await axios.get(`${BACKEND_URL}/api/egreso/${egresoId}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setEgresoData(data)
            } catch (error) {
                console.error('Error al buscar el objeto:', error);
            }
        };

        if (isOpen && egresoId) {
            buscarIngreso()
        }

    }, [isOpen, egresoId]);

    if (!isOpen) return null;


    return (
        <>
            <div className="modal">
                <div className="modal-content">
                    <button className="close-button" onClick={onClose}>
                        <IoCloseCircleOutline />
                    </button>
                    {egresoData ? (
                        <div>
                            <p><span>valor:</span> {formatearMoneda(egresoData.valor)}</p>
                            <p><span>Concepto:</span> {egresoData.concepto}</p>
                            <p><span>Concepto:</span> {egresoData.observacion}</p>
                            <p><span>Fecha:</span> {egresoData.fecha}</p>
                        </div>
                    ) : (
                        <p>Cargando...</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default ModalEgreso