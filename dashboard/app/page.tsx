import { fetchEvalData } from "@/lib/s3";
import { Activity, Database, Server, Terminal, ShieldCheck } from "lucide-react";

export default async function Dashboard() {
  const data = await fetchEvalData();

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
            value={data ? "REACHABLE" : "DISCONNECTED"} 
            icon={<Server className="text-blue-400" size={20} />}
            desc="LocalStack Docker Container"
          />
          <StatCard 
            title="Latest Evaluation" 
            value={data ? data.result : "PENDING"} 
            icon={<ShieldCheck className="text-emerald-400" size={20} />}
            desc={data ? `Agent: ${data.agent}` : "Run 'python agent.py'"}
          />
          <StatCard 
            title="Data Source" 
            value="S3 BUCKET" 
            icon={<Database className="text-purple-400" size={20} />}
            desc="agent-bench-results"
          />
        </div>

        {/* JSON Raw Output */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <Terminal size={18} />
            <h2 className="text-sm font-semibold uppercase tracking-wider">Live S3 Payload</h2>
          </div>
          <div className="bg-black/50 rounded-lg p-5 border border-white/5 overflow-x-auto">
            {data ? (
              <pre className="text-blue-300 font-mono text-sm">
                {JSON.stringify(data, null, 2)}
              </pre>
            ) : (
              <p className="text-zinc-600 italic text-sm text-center py-10">
                Waiting for data... Ensure LocalStack is up and agent.py has run.
              </p>
            )}
          </div>
        </div>
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