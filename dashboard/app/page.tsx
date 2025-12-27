import { fetchEvalData } from "@/lib/s3";
import { Activity, Database, Server, Terminal, ShieldCheck } from "lucide-react";

// This tells Next.js to refresh the data every 10 seconds
export const revalidate = 10; 

export default async function Dashboard() {
  const allData = await fetchEvalData();
  // Get the most recent entry for the top cards
  const latest = Array.isArray(allData) && allData.length > 0 ? allData[0] : null;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Terminal-Bench Observer
            </h1>
            <p className="text-zinc-500 text-sm mt-1">AI Agent Evaluation • Sneha Pasam</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-zinc-300">LOCALSTACK_S3: ACTIVE</span>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="System Status" 
            value={latest ? "REACHABLE" : "DISCONNECTED"} 
            icon={<Server className="text-blue-400" size={20} />}
            desc="LocalStack Docker Container"
          />
          <StatCard 
            title="Latest Accuracy" 
            value={latest ? latest.metrics.accuracy : "0%"} 
            icon={<ShieldCheck className="text-emerald-400" size={20} />}
            desc={latest ? `Agent: ${latest.agent}` : "No data available"}
          />
          <StatCard 
            title="Avg Latency" 
            value={latest ? latest.metrics.latency : "N/A"} 
            icon={<Activity className="text-purple-400" size={20} />}
            desc="Current Response Time"
          />
        </div>

        {/* Evaluation History Table */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 text-zinc-400">
            <Activity size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Evaluation History</h2>
          </div>
          <div className="overflow-x-auto text-sm font-mono">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 text-xs">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Latency</th>
                  <th className="pb-3 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allData.map((log: any, i: number) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="py-3 text-zinc-500">{log.last_updated}</td>
                    <td className="py-3 text-emerald-400 font-bold">{log.result}</td>
                    <td className="py-3 text-blue-400">{log.metrics.latency}</td>
                    <td className="py-3 text-right text-purple-400">{log.metrics.accuracy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Raw Output (Collapsed View) */}
        <details className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 cursor-pointer">
          <summary className="flex items-center gap-2 text-zinc-400 text-sm font-semibold uppercase tracking-wider">
            <Terminal size={18} />
            Raw S3 Payload (Latest)
          </summary>
          <div className="mt-4 bg-black/50 rounded-lg p-5 border border-white/5 overflow-x-auto">
            <pre className="text-blue-300 font-mono text-xs">
              {JSON.stringify(latest, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, desc }: { title: string, value: string, icon: any, desc: string }) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:bg-zinc-800/50 transition-all">
      <div className="flex justify-between items-start mb-4">
        <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold mb-1">{value}</div>
      <p className="text-zinc-600 text-xs">{desc}</p>
    </div>
  );
}