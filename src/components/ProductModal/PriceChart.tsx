'use client';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PricePoint } from '@/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface PriceChartProps {
  history: PricePoint[];
}

export default function PriceChart({ history }: PriceChartProps) {
  const labels = history.map(h => {
    const d = new Date(h.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  const prices = history.map(h => h.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const current = prices[prices.length - 1];
  const first = prices[0];
  const isDown = current <= first;

  const lineColor = isDown ? '#10B981' : '#EF4444';
  const fillColor = isDown ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)';

  const data = {
    labels,
    datasets: [{
      data: prices,
      borderColor: lineColor,
      backgroundColor: fillColor,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 5,
      pointHitRadius: 20,
      pointBackgroundColor: lineColor,
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) => `₩${ctx.parsed.y.toLocaleString('ko-KR')}`,
        },
        backgroundColor: '#1E293B',
        titleColor: '#94A3B8',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          color: '#94A3B8',
          maxTicksLimit: 7,
        },
        border: { display: false },
      },
      y: {
        min: Math.floor(min * 0.97),
        max: Math.ceil(max * 1.03),
        grid: { color: '#F1F5F9' },
        ticks: {
          font: { size: 11 },
          color: '#94A3B8',
          callback: (v: string | number) => `₩${Number(v).toLocaleString()}`,
          maxTicksLimit: 5,
        },
        border: { display: false },
      },
    },
  };

  return <Line data={data} options={options as Parameters<typeof Line>[0]['options']} />;
}
