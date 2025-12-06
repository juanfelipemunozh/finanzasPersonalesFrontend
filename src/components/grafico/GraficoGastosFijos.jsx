import { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { BACKEND_URL } from '../../config/url';
import {Spinner} from '../../helpers/Spinner';


const GraficoGastosFijos = () => {

    const [chartData, setChartData] = useState(null);
    ChartJS.register(ArcElement, Tooltip, Legend);

    useEffect(() => {
        obtenerGastosFijos();
    }, []);

    const obtenerGastosFijos = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`${BACKEND_URL}/api/gastoFijo/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = response.data;

            const conceptos = data.map((item) => item.concepto);
            const valores = data.map((item) => item.valor);
            const sumaConceptos = {};

            conceptos.map((concepto, index) => {
                if (sumaConceptos.hasOwnProperty(concepto)) {
                    sumaConceptos[concepto] += valores[index];
                } else {
                    sumaConceptos[concepto] = valores[index]
                }
            })
            // Crea el objeto chartData con los valores y colores
            const chartData = {
                labels: Object.keys(sumaConceptos),
                datasets: [
                    {
                        label: 'Datos',
                        data: Object.values(sumaConceptos),
                        backgroundColor: Object.values(sumaConceptos).map(() => colorGrafico()),
                        hoverBackgroundColor: Object.values(sumaConceptos).map(() => colorGrafico()),
                    },
                ],
            };

            setChartData(chartData);
        } catch (error) {
            console.log(error);
        }
    };

    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Control Gastos Fijos'
            }
        }
    }


    // Genera un color aleatorio en formato hexadecimal
    const colorGrafico = () => {
        const letras = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letras[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div>
            {chartData ? (
                <Pie data={chartData} options={options} />
            ) : (                    
                <Spinner />  
            )}
        </div>
    );
};

export default GraficoGastosFijos;
