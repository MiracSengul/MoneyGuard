import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Filler
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import { useMemo } from 'react';
  import css from './CurrencyChart.module.css';
  import { getFromLocalStorage } from '../../services/currencyService.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  
  const CurrencyChart = () => {
    const { chartData, chartOptions } = useMemo(() => {
      const cachedData = getFromLocalStorage();
      const usdData = cachedData?.data?.find(item => item.currencyCodeA === 840);
      const eurData = cachedData?.data?.find(item => item.currencyCodeA === 978);
  
      if (!usdData || !eurData) {
        return { chartData: null, chartOptions: null };
      }
  
      const labels = ['USD Buy', 'EUR Buy', 'USD Sell', 'EUR Sell'];
      const mainData = [
        usdData.rateBuy,
        eurData.rateBuy,
        usdData.rateSell,
        eurData.rateSell
      ];
  
      const backgroundData = mainData.map(value => value - 0.8);
  
      const data = {
        labels,
        datasets: [
          {
            label: 'Exchange Rates',
            data: mainData,
            borderColor: '#FF6B8B',
            borderWidth: 3,
            fill: false,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: 'rgba(57, 0, 150, 0.3)',
            pointBorderColor: '#FF6B8B',
            pointBorderWidth: 2,
          },
          {
            label: 'Background',
            data: backgroundData,
            backgroundColor: (context) => {
              const chart = context.chart;
              const { ctx, chartArea } = chart;
              if (!chartArea) return null;
  
              const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
              gradient.addColorStop(0, 'rgba(255, 107, 139, 0.1)');
              gradient.addColorStop(0.3, 'rgba(255, 107, 139, 0.2)');
              gradient.addColorStop(0.6, 'rgba(255, 107, 139, 0.1)');
              gradient.addColorStop(1, 'rgba(255, 107, 139, 0)');
              return gradient;
            },
            borderWidth: 0,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
          }
        ]
      };
  
      const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#2D2B55',
            titleColor: '#FFFFFF',
            bodyColor: '#FFFFFF',
            borderColor: '#FF6B8B',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context) {
                return `${context.dataset.label === 'Exchange Rates' ? 'Rate' : 'Background'}: ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            display: false,
            grid: {
              display: false
            }
          },
          y: {
            display: false,
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        },
        elements: {
          line: {
            tension: 0.4
          }
        }
      };
  
      return { chartData: data, chartOptions: options };
    }, []);
  
    if (!chartData) {
      return (
        <div className={css.chartContainer}>
          <div className={css.noData}>No currency data available</div>
        </div>
      );
    }
  
    return (
      <div className={css.chartContainer}>
        <div className={css.chartTitle}>Exchange Rates Overview</div>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  };
  
  export default CurrencyChart;