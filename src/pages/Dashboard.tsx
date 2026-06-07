import { useEffect, useState, useMemo } from 'react';
import { getComplaints, ComplaintData } from '../firebase/db';
import { Loader2, PieChart as PieChartIcon, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [issues, setIssues] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComplaints().then(data => {
      setIssues(data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = issues.length;
    const resolved = issues.filter(i => i.status === 'RESOLVED').length;
    const pending = issues.filter(i => i.status === 'PENDING').length;
    const inProgress = issues.filter(i => i.status === 'IN_PROGRESS').length;
    
    // Category Breakdown
    const categoryCount: Record<string, number> = {};
    issues.forEach(i => {
      categoryCount[i.category] = (categoryCount[i.category] || 0) + 1;
    });
    const categoryPairs = Object.entries(categoryCount).sort((a,b) => b[1] - a[1]);

    // Ward Breakdown
    const wardCount: Record<string, number> = {};
    issues.forEach(i => {
      wardCount[i.wardNumber] = (wardCount[i.wardNumber] || 0) + 1;
    });
    const wardPairs = Object.entries(wardCount).sort((a,b) => b[1] - a[1]);

    return { total, resolved, pending, inProgress, categoryPairs, wardPairs, resolutionRate: total ? Math.round((resolved/total)*100) : 0 };
  }, [issues]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time statistics for Melvisharam TVK issues.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Issues</p>
            <p className="text-3xl font-black text-slate-800 mt-2">{stats.total}</p>
          </div>
          <div className="bg-slate-100 p-4 rounded-full text-slate-600">
            <PieChartIcon className="w-8 h-8" />
          </div>
        </motion.div>
        
        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.1}} className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-black text-slate-800 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-amber-100 p-4 rounded-full text-amber-600">
            <Clock className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.2}} className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">In Progress</p>
            <p className="text-3xl font-black text-slate-800 mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-full text-blue-600">
            <Activity className="w-8 h-8" />
          </div>
        </motion.div>

        <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: 0.3}} className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Resolved</p>
            <p className="text-3xl font-black text-slate-800 mt-2">{stats.resolved}</p>
          </div>
          <div className="bg-green-100 p-4 rounded-full text-green-600 relative">
            <CheckCircle className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border-2 border-white">
              {stats.resolutionRate}%
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category breakdown */}
        <div className="bg-white rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Issues by Category</h2>
            <AlertCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {stats.categoryPairs.length > 0 ? stats.categoryPairs.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1 font-bold">
                  <span className="text-slate-600">{cat}</span>
                  <span className="text-slate-800">{count} ({Math.round(count/stats.total*100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(count/stats.total)*100}%` }}></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>

        {/* Ward Breakdown */}
        <div className="bg-white rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Most Active Wards</h2>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            {stats.wardPairs.length > 0 ? (
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-500 border-b border-slate-100">Ward Number</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 border-b border-slate-100 text-right">Total Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.wardPairs.map(([ward, count], idx) => (
                    <tr key={ward} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-slate-800">
                        <span className="inline-block w-6 text-slate-400 font-mono text-xs">{idx + 1}.</span> 
                        <span className="font-bold">Ward {ward}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs">{count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">No data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Activity = (props: React.ComponentProps<'svg'>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)
