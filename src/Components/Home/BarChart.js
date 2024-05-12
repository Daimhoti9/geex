// BarChart.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChart = ({ title , data}) => {

    console.log("Recrutments data:", data);

    // Initialize an array to represent counts for each month
    const monthCounts = [0, 0, 0, 0, 0];

    // Get the current date
    const currentDate = new Date();

    // Iterate over the data and update the counts array
    data.forEach(entry => {
    // Get the month from the dateEdited field
    const editedDate = new Date(entry.dateEdited);
    const monthDifference = currentDate.getMonth() - editedDate.getMonth();
    
    // Only consider entries from the last five months
    if (monthDifference < 5) {
        // Increment the count for the corresponding month
        monthCounts[monthDifference]++;
    }
    });

    console.log("Recrutments in last five months",monthCounts);


    function getLastFiveMonths() {
        // Array to store the names of the last five months
        const lastFiveMonths = [];
      
        // Get the current date
        const currentDate = new Date();
      
        // Iterate over the last five months
        for (let i = 0; i < 5; i++) {
          // Calculate the month index for the previous months
          const monthIndex = (currentDate.getMonth() - i + 12) % 12;
      
          // Create a new Date object for the current month and year
          const currentMonth = new Date(currentDate.getFullYear(), monthIndex);
      
          // Get the name of the month
          const monthName = currentMonth.toLocaleString('en-US', { month: 'long' });
      
          // Push the month name to the array
          lastFiveMonths.push(monthName);
        }
      
        return lastFiveMonths;
      }
      
      // Example usage
      const lastFiveMonths = getLastFiveMonths();
      console.log("names of last five months: ",lastFiveMonths);
      

    const chartOptions = {
        chart: {
            type: 'bar',
            stacked: true,
        },
        colors: ["#FFBB54", "#00A389"],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: lastFiveMonths,
        },
        legend: {
            position: 'bottom',
        },
    };

    const series = [
        {
            name: 'Series 1',
            data: monthCounts,
        },
    ];

    return (
        <div className="w-full md:w-1/2">
            <div className="flex flex-col gap-5 overflow-hidden">
                <div>
                    <p className="text-xl font-semibold text-center">Charts</p>
                </div>
                <div className="bg-white">
                    <ReactApexChart options={chartOptions} series={series} type="bar" height={350} />
                </div>
            </div>
        </div>
    );
};

export default BarChart;
