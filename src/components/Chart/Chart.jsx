import {
  Chart as PieChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import css from './Chart.module.css';
import { useSelector } from 'react-redux';
import { colorSelect } from '../../utils/colorSelect';

PieChartJS.register(CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

function ExpenseChart() {
  const transactionsSummaryData = useSelector(
    state => state.transactions.transactionsSummary
  );

  const hasExpenseData = transactionsSummaryData.expenseSummary < 0;
  const hasYearData = transactionsSummaryData.year !== 0;

  const { chartData, totalAmount } = transactionsSummaryData.categoriesSummary.reduce(
    (acc, category) => {
      if (category.name !== 'Income') {
        const amount = category.total < 0 ? Math.abs(category.total) : category.total;
        acc.chartData.labels.push(category.name);
        acc.chartData.data.push(amount);
        acc.chartData.colors.push(colorSelect(category.name));
        acc.totalAmount += amount;
      }
      return acc;
    },
    { 
      chartData: { labels: [], data: [], colors: [] }, 
      totalAmount: 0 
    }
  );

  const dataset = hasExpenseData
    ? {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Spending Amount',
            data: chartData.data,
            borderWidth: 0,
            backgroundColor: chartData.colors,
          },
        ],
      }
    : {
        labels: ['No Expenses'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#e5e7eb'],
            borderWidth: 0,
          },
        ],
      };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: { 
        enabled: hasExpenseData,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div className={css.chartContainer}>
      <div className={css.chartBox}>
        <h3 className={css.chartTitle}>Expense Statistics</h3>
        
        <div className={css.chartAmount}>
          ${transactionsSummaryData.periodTotal}
        </div>

        {hasYearData && (
          <Doughnut data={dataset} options={chartOptions} />
        )}
        
        {!hasYearData && (
          <div className={css.noData}>
            No data available for selected period
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseChart;
