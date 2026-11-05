import Chart from 'chart.js';
import _ from 'lodash';
import { capitalize } from './utils';

const COLORS = [
  '#f75c49', '#1a9cb0', '#ecec33', '#464547', '#f99589', '#7cb342',
  '#8e6cc9', '#ff9f40', '#4bc0c0', '#c9cbcf', '#e57373', '#3f51b5',
];

let chart = null;

const getAgeGroup = (age) => {
  if (!_.isNumber(age)) return 'Unknown';
  if (age <= 31) return '18-31';
  if (age <= 45) return '32-45';
  return '46+';
};

const getGroupName = (user, field) => {
  if (field === 'age') return getAgeGroup(user.age);
  if (field === 'gender') return capitalize(user.gender);
  return user[field] || 'Unknown';
};

const renderChart = (users, field) => {
  const counts = _.countBy(users, (user) => getGroupName(user, field));
  const labels = _.keys(counts);
  const data = _.values(counts);
  const colors = _.map(labels, (label, index) => COLORS[index % COLORS.length]);

  if (!chart) {
    chart = new Chart(document.getElementById('stats-chart'), {
      type: 'pie',
      data: { labels, datasets: [{ data, backgroundColor: colors }] },
      options: {
        maintainAspectRatio: false,
        legend: { position: 'right' },
      },
    });
    return;
  }

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.data.datasets[0].backgroundColor = colors;
  chart.update();
};

export default renderChart;
