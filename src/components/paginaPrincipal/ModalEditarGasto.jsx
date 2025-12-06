import axios from "axios";
import './modaleditargasto.css';
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from 'react-icons/io5'
import { BACKEND_URL } from "../../config/url";

const ModalEditarGasto = ({ isOpen, onClose, gastoId }) => {
  const [gastoData, setGastoData] = useState(null);
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

  useEffect(() => {
    const buscarGasto = async () => {
      const token = localStorage.getItem('token');

      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/gastoFijo/${gastoId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGastoData(data);
        setValor(data.valor);
        setConcepto(data.concepto);
        setObservacion(data.observacion)
        setFecha(data.fecha)
      } catch (error) {
        console.error('Error al buscar el objeto:', error);
      }
    };

    if (isOpen && gastoId) {
      buscarGasto();
    }
  }, [isOpen, gastoId]);

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

  const handleModificar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(`${BACKEND_URL}/api/gastoFijo/${gastoId}`, {
        valor: valor,
        concepto: concepto,
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
        {gastoData ? (

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
            <label htmlFor="observacion">Observacion</label>
            <input
              className="form-item"
              type="text"
              id="observacion"
              value={observacion}
              onChange={handleObservacionChange}
            />
            <label htmlFor="fecha">Fecha</label>
            <input
              className="form-item"
              type="date"
              id="fecha"
              value={fecha}
              onChange={handleFechaChange}
            />
            <input type="submit" className="btn-guardar" value={"Modificar"} />
          </form>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>

  );
};

export default ModalEditarGasto;
