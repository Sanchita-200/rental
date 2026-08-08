import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, DollarSign, Calendar } from 'lucide-react';
import { analyticsApi } from '../../api/analytics.api';
import { aiApi } from '../../api/ai.api';
import type { RevenuePoint, AIDemandForecastResponse } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const [chartData, setChartData] = useState<RevenuePoint[]>([]);
  const [aiDemand, setAiDemand] = useState<AIDemandForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      analyticsApi.getRevenueChart(),
      aiApi.getDemandPrediction()
    ]).then(([chartRes, demandRes]) => {
      setChartData(chartRes);
      setAiDemand(demandRes);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      <div>
        <h1 className="text-2xl font-black text-white">Revenue & Demand Analytics</h1>
        <p className="text-xs text-slate-400">Financial trends, late fee collections, and AI predictive demand growth</p>
      </div>

      {/* Revenue Time-Series Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Past 7 Days Revenue Trend</h3>
          </div>
          <span className="text-[10px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
            Rental Fees vs Late Penalties
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="rental_income" name="Rental Income (₹)" stroke="#6366f1" fillOpacity={1} fill="url(#colorRent)" />
              <Area type="monotone" dataKey="late_fee_income" name="Late Penalty Income (₹)" stroke="#f43f5e" fillOpacity={1} fill="url(#colorLate)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Demand Predictive Cards */}
      {aiDemand && (
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-cyan-950/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-cyan-400" /> AI Demand Forecasting ({aiDemand.forecast_period})
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
              Predictive Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiDemand.forecasts.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white">{item.category_name}</h4>
                <div className="text-xs font-extrabold text-emerald-400">{item.projected_demand_growth}</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.pricing_recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
