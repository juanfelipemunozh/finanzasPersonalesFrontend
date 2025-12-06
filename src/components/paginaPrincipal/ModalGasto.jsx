import { useEffect, useState } from 'react';
import './modalgasto.css'; 
import axios from 'axios';
import { IoCloseCircleOutline } from 'react-icons/io5'
import { formatearMoneda } from '../../helpers/formatoMoneda';
import { BACKEND_URL } from '../../config/url';

const ModalGasto = ({ isOpen, onClose, gastoId }) => {
  const [gastoData, setGastoData] = useState(null)

  useEffect(() => {
    const buscarGasto = async () => {
      const token = localStorage.getItem('token');

      try {
        const {data} = await axios.get(`${BACKEND_URL}/api/gastoFijo/${gastoId}`, {
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setGastoData(data);
      } catch (error) {
        console.error('Error al buscar el objeto:', error);
      }
    };

    if (isOpen && gastoId ) {
      buscarGasto();
    }
  }, [isOpen, gastoId]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          <IoCloseCircleOutline />
        </button>
        {gastoData ? (
          <div>
            <p><span>valor:</span> {formatearMoneda(gastoData.valor)}</p>
            <p><span>Concepto:</span> {gastoData.concepto}</p>
            <p><span>Observacion:</span> {gastoData.observacion}</p>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
  );
};

export default ModalGasto;
