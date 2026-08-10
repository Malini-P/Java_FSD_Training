import { useEffect, useRef } from "react"
import Chart from 'chart.js/auto'

// Receives stats as prop from AdminWidget — no separate API call needed
const AssetBarChart = ({ stats }) => {

    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    useEffect(() => {
        // Only build chart when stats data is available
        if (!stats || !canvasRef.current) return;

        const data = {
            labels: ['Available', 'Allocated', 'Under Service'],
            datasets: [
                {
                    label: 'Asset Status Count',
                    data: [
                        stats.availableAssets,
                        stats.allocatedAssets,
                        stats.assetsUnderService
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgb(75, 192, 192)',
                        'rgb(255, 159, 64)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 1
                }
            ]
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        // Destroy any previous chart instance before drawing a new one
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data,
            options
        })

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        }

    }, [stats]) // re-runs whenever stats prop changes

    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default AssetBarChart