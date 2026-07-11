import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const DonutChart = ({ data }) => {
  // Map data to Recharts format
  const chartData = [
    { name: 'Normal', value: data.good || 0, color: '#674bb5' }, // primary
    { name: 'Repair', value: data.repair || 0, color: '#e4e1e6' }, // secondary-container
    { name: 'Broken', value: data.broken || 0, color: '#18181b' }, // zinc-900
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const goodPercentage = total > 0 ? Math.round((data.good / total) * 100) : 0;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
        <span className="font-headline text-3xl font-bold text-on-surface">{goodPercentage}%</span>
        <span className="text-[10px] font-sans font-bold tracking-widest text-on-surface-variant uppercase mt-1">Good</span>
      </div>
      
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
            itemStyle={{ fontSize: '14px', fontWeight: 500 }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="flex gap-4 mt-2 justify-center w-full">
        {chartData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-xs font-sans text-on-surface-variant">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
