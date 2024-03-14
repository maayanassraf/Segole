import { Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js"
  
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const LineGraph = (props) => {

    const data = {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        datasets: [
            {
                data: props.dots,
                fill: false,
                borderWidth: 2,
                borderColor: (context) => {
                    const ctx = context.chart.ctx
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200)
                    gradient.addColorStop(0, "rgb(32, 64, 224)")
                    gradient.addColorStop(0.3, "rgba(215, 58, 205, 0.64)")
                    gradient.addColorStop(1, "rgb(249, 61, 18)")
                    return gradient
                },
                backgroundColor: 'none'
            }
        ]
    }

    const options = {
        plugins: {
            title: {
                display: true,
                text: "Last 10 Values"
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                display: false
            },
            x: {
                display: false
            }
        }   
    }    

    return (
        <div>
            <Line data={data} options={options} />
        </div>
    )
}

export default LineGraph