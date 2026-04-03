"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';

interface BlogVisualizationProps {
  type: 'bar' | 'area' | 'pie';
  data: Array<{ name: string; value: number }>;
  title?: string;
}

const COLORS = ['#005FB8', '#6750A4', '#B3261E', '#006A6A', '#984061', '#4F6378'];

export default function BlogVisualization({ type, data, title }: BlogVisualizationProps) {
  return (
    <div className="my-12 p-8 bg-surface-container-low rounded-2xl border border-outline-variant/10 shadow-sm">
      {title && (
        <h3 className="text-primary font-manrope font-bold text-lg mb-8 text-center uppercase tracking-tight">
          {title}
        </h3>
      )}
      
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#4F6378', fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#4F6378' }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px 16px'
                }}
                labelStyle={{ fontWeight: 800, color: '#005FB8', marginBottom: '4px' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : type === 'area' ? (
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#005FB8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#005FB8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#4F6378', fontWeight: 600 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#4F6378' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px 16px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#005FB8" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  padding: '12px 16px'
                }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
      
      <p className="mt-8 text-[10px] text-center text-on_surface-variant uppercase tracking-widest font-bold">
        Source: Statistics Canada, 2021 Census of Population
      </p>
    </div>
  );
}
