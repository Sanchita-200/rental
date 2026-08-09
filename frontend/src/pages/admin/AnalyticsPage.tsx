import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import { analyticsApi } from '../../api/analytics.api';
import { aiApi } from '../../api/ai.api';
import type { RevenuePoint, AIDemandForecastResponse } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const [chartData, setChartData] = useState<RevenuePoint[]>([]);
  const [aiDemand, setAiDemand] = useState<AIDemandForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const forecastData = [
    { day: 'Mon', Cameras: 85, Gaming: 90, Tools: 95 },
    { day: 'Tue', Cameras: 80, Gaming: 85, Tools: 92 },
    { day: 'Wed', Cameras: 72, Gaming: 88, Tools: 88 },
    { day: 'Thu', Cameras: 60, Gaming: 70, Tools: 85 },
    { day: 'Fri', Cameras: 35, Gaming: 45, Tools: 72 },
    { day: 'Sat', Cameras: 18, Gaming: 25, Tools: 58 },
    { day: 'Sun', Cameras: 30, Gaming: 40, Tools: 65 },
  ];

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
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-[#0E1F18] border border-green-500/20 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Cockpit</span>
        </Link>
      </div>

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

      {/* Product Availability & Utilization Forecast Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-green-500/20 space-y-4 shadow-xl animate-fade-in bg-[#0A1813]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">7-Day Product Availability & Stock Forecast</h3>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25 font-bold uppercase">
            Estimated Availability %
          </span>
        </div>
        <p className="text-xs text-slate-400">
          AI-generated prediction of inventory booking levels and potential stock bottlenecks for the upcoming week.
        </p>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorCameras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorGaming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTools" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="Cameras" name="Cameras & Photography" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCameras)" strokeWidth={2} />
              <Area type="monotone" dataKey="Gaming" name="Gaming & Electronics" stroke="#10b981" fillOpacity={1} fill="url(#colorGaming)" strokeWidth={2} />
              <Area type="monotone" dataKey="Tools" name="Power Tools & Hardware" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTools)" strokeWidth={2} />
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
