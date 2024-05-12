// DonutChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = ({ title, value, data }) => {
    const chartOptions = {
        series: data,
        colors: ["#EF9A91", "#00A389", "#FFBB54"],
        chart: {
            height: 320,
            width: "100%",
            type: "donut",
        },
        stroke: {
            colors: ["transparent"],
            lineCap: "",
        },
        labels: ["Agents", "Candidates", "Jobs"],
        dataLabels: {
            enabled: false,
        },
        legend: {
            position: "bottom",
            fontFamily: "Inter, sans-serif",
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '75%',
                },
            },
        },
        grid: {
            padding: {
              top: -2,
            },
        },
    };

    return (
        <div className="w-full h-full ml-0 sm:ml-32 md:w-1/4">
            <div className="">
                <div>
                    <p className="ml-10 text-xl font-semibold text-center">Chart Summary</p>
                </div>
                <div className='flex items-center justify-center w-full h-full mt-10 sm:mt-24'>
                    <ReactApexChart options={chartOptions} series={data} type="donut" width={350} height={350}/>
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
