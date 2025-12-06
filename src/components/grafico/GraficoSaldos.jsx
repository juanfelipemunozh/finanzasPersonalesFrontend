import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale } from 'chart.js';
import { Chart, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { BACKEND_URL } from '../../config/url';
import {Spinner} from '../../helpers/Spinner';

const GraficoSaldos = () => {
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);
  Chart.register(LineElement, PointElement, LinearScale, Title);
  const [datosGrafica, setDatosGrafica] = useState(null);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    const token = localStorage.getItem('token');

    try {
      const [ingresos, egresos] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/ingreso/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axios.get(`${BACKEND_URL}/api/egreso/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const datosIngresos = ingresos.data;
      const datosEgresos = egresos.data;

      const datosGrafico = procesarDatos(datosIngresos, datosEgresos);
      setDatosGrafica(datosGrafico);
    } catch (error) {
      console.log(error);
    }
  };

  // Función auxiliar para obtener el mes y el año de una fecha
  const obtenerMesYAño = (fecha) => {
    const fechaCompleta = new Date(fecha);
    const mes = fechaCompleta.getMonth() + 1; // Los meses en JavaScript son zero-based, por eso se suma 1
    const anio = fechaCompleta.getFullYear();
    return { mes, anio };
  };

  const agruparPorMesYAño = (datos) => {
    const datosPorMesYAño = new Map();
    for (const dato of datos) {
      const { mes, anio } = obtenerMesYAño(dato.fecha);
      const mesAnio = `${mes}-${anio}`;
      if (datosPorMesYAño.has(mesAnio)) {
        const valorAcumulado = datosPorMesYAño.get(mesAnio).valor + dato.valor;
        datosPorMesYAño.set(mesAnio, { mes, anio, valor: valorAcumulado });
      } else {
        datosPorMesYAño.set(mesAnio, { mes, anio, valor: dato.valor });
      }
    }
    //console.log(datosPorMesYAño);
    return datosPorMesYAño;
  };


  const procesarDatos = (datosIngresos, datosEgresos) => {
    const ingresosPorMes = agruparPorMesYAño(datosIngresos);
    const egresosPorMes = agruparPorMesYAño(datosEgresos);

    const labels = [];
    const saldos = [];

    let saldoAcumulado = 0;

    for (const [mesAnio, ingreso] of ingresosPorMes.entries()) {
      const egreso = egresosPorMes.get(mesAnio);
      const ingresoValor = ingreso ? ingreso.valor : 0;
      const egresoValor = egreso ? egreso.valor : 0;
      saldoAcumulado += ingresoValor - egresoValor;

      labels.push(`${ingreso.mes}-${ingreso.anio}`);
      saldos.push(saldoAcumulado);
    }

    const data = {
      labels,
      datasets: [
        {
          label: 'Saldo acumulado',
          data: saldos,
          fill: false,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: 'rgba(53, 162, 235, 0.5)'
        },
      ],
    };

    return data;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfica Saldo Disponible'
      }
    }
  }

  return (
    <div>
      {datosGrafica ? ( <Line options={options} data={datosGrafica} /> ) : ( <Spinner />)}
    </div>
  );
};

export default GraficoSaldos;
