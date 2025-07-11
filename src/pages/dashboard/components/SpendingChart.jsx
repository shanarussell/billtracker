import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SpendingChart = ({ chartType = 'bar', data, title }) => {
  const monthlyData = [
    { month: 'Jan', amount: 2850 },
    { month: 'Feb', amount: 3200 },
    { month: 'Mar', amount: 2950 },
    { month: 'Apr', amount: 3100 },
    { month: 'May', amount: 2800 },
    { month: 'Jun', amount: 3350 },
    { month: 'Jul', amount: 3150 }
  ];

  const categoryData = [
    { name: 'Utilities', value: 450, color: '#1E40AF' },
    { name: 'Credit Cards', value: 850, color: '#059669' },
    { name: 'Loans', value: 1200, color: '#D97706' },
    { name: 'Insurance', value: 300, color: '#DC2626' },
    { name: 'Subscriptions', value: 200, color: '#7C3AED' }
  ];

  const chartData = data || (chartType === 'bar' ? monthlyData : categoryData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{label}</p>
          <p className="text-sm text-slate-600">
            Amount: <span className="font-semibold">${payload[0].value.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="month" 
          stroke="#64748B" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#64748B" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="amount" 
          fill="#1E40AF" 
          radius={[4, 4, 0, 0]}
          className="hover:opacity-80 transition-opacity duration-200"
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
          labelStyle={{ color: '#0F172A' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          {title || (chartType === 'bar' ? 'Monthly Spending Trend' : 'Spending by Category')}
        </h3>
      </div>

      <div className="w-full h-80">
        {chartType === 'bar' ? renderBarChart() : renderPieChart()}
      </div>

      {chartType === 'pie' && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {categoryData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpendingChart;