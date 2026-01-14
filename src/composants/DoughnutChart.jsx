

import { Chart as ChartJS, ArcElement, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Enregistrer les composants nécessaires
// ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ labels, data, colors, title }) => {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: !!title, text: title, font: { size: 16 } },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;
