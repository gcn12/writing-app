import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, TimeScale, TimeSeriesScale } from 'chart.js'
import { useEffect } from 'react'
import moment from 'moment'

Chart.register(LinearScale, LineController, CategoryScale, PointElement, LineElement, TimeScale, TimeSeriesScale)

const data = [10]

const Chartjs = () => {

    useEffect(()=> {
        const ctx = document.getElementById('chart-1').getContext('2d')
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan 10, 2018', moment().format("2021-01-02"), moment().format("2021-01-10"), moment().format("2021-01-20"),  moment().format("YYYY-MM-DD")],
                datasets: [{
                    label: '# people',
                    data
                }]
            }, 
            options: {
                scales: {
                    // x: {
                    //     type: 'timeseries'
                    // }
                }
            }
        })
    }, [])

    return(
        <div>
            <canvas id='chart-1' width='100' height='100' />
        </div>
    )
}

export default Chartjs