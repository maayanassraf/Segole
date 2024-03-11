import { Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineGraph = (props) => {

    return (
        <div>
            <Line data={{
                datasets: [
                    {
                        data: props.dots,
                        fill: false,
                        borderWidth: 4,
                        borderColor:'green',
                        responsive:true,
                        options: {        
                            legend: {
                              display: false
                            }
                          }                          
                    }
                ]
            }} />
        </div>
    )
}

export default LineGraph