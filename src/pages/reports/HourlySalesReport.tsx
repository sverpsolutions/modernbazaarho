import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const fmt = (n: number) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;

const HOUR_LABELS = ['12AM','1AM','2AM','3AM','4AM','5AM','6AM','7AM','8AM','9AM','10AM','11AM',
                     '12PM','1PM','2PM','3PM','4PM','5PM','6PM','7PM','8PM','9PM','10PM','11PM'];

const HourlySalesReport = () => {
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [outletId, setOutletId] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const params: any = { from_date: fromDate, to_date: toDate };
      if (outletId) params.outlet_id = outletId;
      const res = await axios.get(`${API}/reports/hourly`, { params });
      setData(res.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const hours = data?.hours || [];
  const maxSales = Math.max(...hours.map((h: any) => h.sales), 1);
  const peakHour = hours.reduce((p: any, c: any) => (c.sales > (p?.sales || 0) ? c : p), null);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-purple-600 text-white p-1 rounded"><i className="fas fa-clock"></i></span>
            Hourly Sales Analysis
          </h1>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Peak Hours · Transaction Volume · Business Intelligence</p>
        </div>
        <button className="btn btn-outline-dark btn-sm" onClick={() => window.print()}><i className="fas fa-print mr-2"></i>Print</button>
      </div>

      <div className="card shadow-sm border-0 bg-white p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">From Date</label>
            <input type="date" className="form-control h-9 text-xs" value={fromDate} onChange={e => setFromDate(e.target.value)} /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">To Date</label>
            <input type="date" className="form-control h-9 text-xs" value={toDate} onChange={e => setToDate(e.target.value)} /></div>
          <div><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Outlet</label>
            <select className="form-control h-9 text-xs w-44" value={outletId} onChange={e => setOutletId(e.target.value)}>
              <option value="">All Outlets</option>
              {data?.outlets?.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select></div>
          <button className="btn btn-dark btn-sm h-9 px-6 text-[10px] font-bold uppercase" onClick={fetch} disabled={loading}>Apply</button>
        </div>
      </div>

      {peakHour && (
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Peak Business Hour</div>
            <div className="text-4xl font-black">{HOUR_LABELS[peakHour.hour]}</div>
            <div className="text-sm opacity-70 mt-1">{peakHour.bills} bills · {fmt(peakHour.sales)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Avg Bill Value</div>
            <div className="text-2xl font-black">{fmt(peakHour.avg_bill)}</div>
          </div>
          <i className="fas fa-fire text-6xl opacity-20"></i>
        </div>
      )}

      {loading ? (
        <div className="p-10 text-center text-slate-400"><i className="fas fa-spinner fa-spin text-2xl"></i></div>
      ) : (
        <div className="card shadow-sm border-0 bg-white overflow-hidden">
          <div className="bg-[#1a1a2e] text-white px-6 py-3">
            <span className="text-xs font-bold uppercase tracking-widest">Hourly Breakdown</span>
          </div>
          <div className="p-6">
            {hours.length === 0 ? (
              <div className="py-10 text-center text-slate-400">
                <i className="fas fa-info-circle mr-2"></i>
                No hourly data — bills may not have timestamp. Check invoice_datetime field.
              </div>
            ) : (
              <div className="space-y-2">
                {hours.map((h: any, i: number) => {
                  const isPeak = h.hour === peakHour?.hour;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${isPeak ? 'bg-purple-50' : 'hover:bg-slate-50'}`}>
                      <div className="w-12 text-right text-xs font-bold text-slate-500 shrink-0">{HOUR_LABELS[h.hour]}</div>
                      <div className="flex-1 bg-slate-100 rounded-full h-5 relative overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isPeak ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
                          style={{ width: `${(h.sales / maxSales) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-28 text-right text-xs font-black font-mono text-slate-700 shrink-0">{fmt(h.sales)}</div>
                      <div className="w-16 text-center text-[10px] text-slate-500 shrink-0">{h.bills} bills</div>
                      {isPeak && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full font-bold">PEAK</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table view */}
      {hours.length > 0 && !loading && (
        <div className="card shadow-sm border-0 overflow-hidden bg-white">
          <table className="w-full text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] uppercase font-bold text-slate-500">Hour</th>
                <th className="px-6 py-3 text-center text-[10px] uppercase font-bold text-slate-500">Bills</th>
                <th className="px-6 py-3 text-right text-[10px] uppercase font-bold text-slate-500">Total Sales</th>
                <th className="px-6 py-3 text-right text-[10px] uppercase font-bold text-slate-500">Avg Bill</th>
                <th className="px-6 py-3 text-center text-[10px] uppercase font-bold text-slate-500">% of Day</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hours.map((h: any, i: number) => (
                <tr key={i} className={h.hour === peakHour?.hour ? 'bg-purple-50 font-bold' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-2.5 font-bold">{HOUR_LABELS[h.hour]} ({h.label})</td>
                  <td className="px-6 py-2.5 text-center">{h.bills}</td>
                  <td className="px-6 py-2.5 text-right font-mono text-green-700">{fmt(h.sales)}</td>
                  <td className="px-6 py-2.5 text-right font-mono text-blue-600">{fmt(h.avg_bill)}</td>
                  <td className="px-6 py-2.5 text-center">
                    <span className="text-[10px] text-slate-500">{h.pct}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HourlySalesReport;
