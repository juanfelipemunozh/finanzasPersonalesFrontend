import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { BACKEND_URL } from '../../config/url';
import { Spinner } from '../../helpers/Spinner';

const GraficoIngresos = () => {

    const [chartData, setChartData] = useState(null);
    ChartJS.register(ArcElement, Tooltip, Legend);

    useEffect(() => {
        obtenerIngresos()
    }, [])

    const obtenerIngresos = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(`${BACKEND_URL}/api/ingreso/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const data = response.data;

            // Sumar valores por concepto
            const conceptos = data.map(item => item.concepto);
            const valores = data.map(item => item.valor);
            const sumaConceptos = {};

            conceptos.map((concepto, index)=>{
                if(sumaConceptos.hasOwnProperty(concepto)){
                    sumaConceptos[concepto] += valores[index]
                } else {
                    sumaConceptos[concepto] = valores[index]
                }
            })
        

            const options = {
                responsive: true,
                maintainAspectRatio: false,
            }

            const chartData = {
                labels: Object.keys(sumaConceptos),
                options: options,
                datasets: [
                    {
                        label: 'Datos',
                        data: Object.values(sumaConceptos),
                        backgroundColor: Object.values(sumaConceptos).map(() => colorGrafico()),
                        hoverBackgroundColor: Object.values(sumaConceptos).map(() => colorGrafico())
                    }
                ]
            }

            setChartData(chartData);
        } catch (error) {
            console.log(error);
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
                <Pie data={chartData} />
            ) : (
                <Spinner />
            )
            }
        </div>
    )
}

export default GraficoIngresos