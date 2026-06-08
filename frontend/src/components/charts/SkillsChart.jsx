import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement
);

const chartColors = {
  blue: 'rgba(59, 130, 246, 0.85)',
  purple: 'rgba(139, 92, 246, 0.85)',
  green: 'rgba(34, 197, 94, 0.85)',
  amber: 'rgba(245, 158, 11, 0.85)',
  red: 'rgba(239, 68, 68, 0.85)',
  cyan: 'rgba(6, 182, 212, 0.85)',
};

export const SkillsDoughnutChart = ({ skills }) => {
  const data = {
    labels: ['Languages', 'Frameworks', 'Databases', 'Tools'],
    datasets: [
      {
        data: [
          skills?.languages?.length || 0,
          skills?.frameworks?.length || 0,
          skills?.databases?.length || 0,
          skills?.tools?.length || 0,
        ],
        backgroundColor: [
          chartColors.blue,
          chartColors.purple,
          chartColors.green,
          chartColors.amber,
        ],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          padding: 16,
          font: { size: 12, family: 'Inter' },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} skills`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const total = (skills?.languages?.length || 0) + (skills?.frameworks?.length || 0) +
    (skills?.databases?.length || 0) + (skills?.tools?.length || 0);

  return (
    <div className="relative" style={{ height: '260px' }}>
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ top: '15%' }}>
        <span className="text-3xl font-bold text-white">{total}</span>
        <span className="text-slate-400 text-xs">Total Skills</span>
      </div>
    </div>
  );
};

export const ScoringRadarChart = ({ breakdown }) => {
  if (!breakdown) return null;

  const labels = Object.values(breakdown).map(b => b.label);
  const scores = Object.values(breakdown).map(b => Math.round((b.score / b.max) * 100));

  const data = {
    labels,
    datasets: [
      {
        label: 'Score %',
        data: scores,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          display: false,
          stepSize: 25,
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        angleLines: { color: 'rgba(148, 163, 184, 0.1)' },
        pointLabels: {
          color: '#94a3b8',
          font: { size: 11, family: 'Inter' },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.r}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '280px' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export const ScoringBarChart = ({ breakdown }) => {
  if (!breakdown) return null;

  const entries = Object.values(breakdown);

  const data = {
    labels: entries.map(e => e.label),
    datasets: [
      {
        label: 'Score',
        data: entries.map(e => e.score),
        backgroundColor: [
          chartColors.blue,
          chartColors.purple,
          chartColors.green,
          chartColors.amber,
          chartColors.cyan,
        ],
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Max',
        data: entries.map(e => e.max),
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.08)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        max: 30,
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: '#334155',
        borderWidth: 1,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '220px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};
