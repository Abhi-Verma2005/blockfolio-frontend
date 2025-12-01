'use client'

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { usePortfolioStore } from '@/lib/store/portfolio-store';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart() {
  const { solanaData, ethereumData } = usePortfolioStore();

  const getChartData = () => {
    const labels: string[] = [];
    const data: number[] = [];
    const colors: string[] = [];

    if (solanaData) {
      if (solanaData.nativeValueUsd > 0) {
        labels.push('SOL');
        data.push(solanaData.nativeValueUsd);
        colors.push('#14F195');
      }
      solanaData.tokens.forEach(token => {
        if (token.valueUsd > 0) {
          labels.push(token.symbol);
          data.push(token.valueUsd);
          colors.push('#9945FF');
        }
      });
    }

    if (ethereumData) {
      if (ethereumData.nativeValueUsd > 0) {
        labels.push('ETH');
        data.push(ethereumData.nativeValueUsd);
        colors.push('#627EEA');
      }
      ethereumData.tokens.forEach(token => {
        if (token.valueUsd > 0) {
          labels.push(token.symbol);
          data.push(token.valueUsd);
          colors.push('#F7931A');
        }
      });
    }

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors,
          borderWidth: 0,
        },
      ],
    };
  };

  const chartData = getChartData();

  if (chartData.labels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
        <div className="text-center text-gray-500 dark:text-gray-400">No data to display</div>
      </div>
    );
  }

  // Calculate total for percentages
  const total = data.reduce((sum, val) => sum + val, 0);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-5">
      <h2 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Portfolio Distribution</h2>
      <div className="flex justify-center">
        <Doughnut 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context: any) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : '0';
                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                  }
                }
              },
              legend: {
                position: 'bottom' as const,
                labels: {
                  generateLabels: (chart: any) => {
                    const data = chart.data;
                    if (data.labels.length === 0) return [];
                    return data.labels.map((label: string, i: number) => {
                      const value = data.datasets[0].data[i];
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                      return {
                        text: `${label} (${percentage}%)`,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        hidden: false,
                        index: i,
                      };
                    });
                  }
                }
              }
            }
          }} 
        />
      </div>
    </div>
  );
}

