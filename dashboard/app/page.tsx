"use client";
import React, { useEffect, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Brain, Clock, ShieldCheck } from "lucide-react";

export default function Dashboard() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        const chartData = data.history
          .filter((item: any) => item.role === 'bot' || item.result === 'SUCCESS')
          .map((item: any) => ({
            time: item.timestamp,
            latency: parseFloat(item.metrics?.latency) || 0,
            displayTime: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }))
          .reverse();

        setHistory(chartData);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const latest = history[history.length - 1] || {};

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-8 font-mono">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white uppercase italic">Terminal-Bench Observer</h1>
          <p className="text-zinc-500 mt-2">AI Agent Performance • Real-time Telemetry</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-green-500 text-sm mb-1 uppercase">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            LocalStack_S3: Active
          </div>
        </div>
      </div>

      {/* Main Stats Grid - Using Divs instead of Card components */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Latest Latency */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Latest Latency</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">{latest.latency ? `${latest.latency}s` : 'N/A'}</div>
          <p className="text-xs text-zinc-500 mt-1">Processing time for last prompt</p>
        </div>

        {/* Agent Status */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Agent Status</span>
            <Brain className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-400">TinyLlama</div>
          <p className="text-xs text-zinc-500 mt-1">Active Local Model</p>
        </div>

        {/* Reliability */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Reliability</span>
            <ShieldCheck className="w-4 h-4 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-400">100.0%</div>
          <p className="text-xs text-zinc-500 mt-1">Zero connection timeouts</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="mb-4">
          <div className="text-lg font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Latency Trend (Seconds)
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="displayTime" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}s`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Area type="monotone" dataKey="latency" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLat)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}