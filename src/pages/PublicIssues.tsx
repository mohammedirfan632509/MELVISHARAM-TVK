import { useEffect, useState, useMemo } from 'react';
import { getComplaints, ComplaintData } from '../firebase/db';
import { formatDistanceToNow } from 'date-fns';
import { Search, MapPin, Loader2, User, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function PublicIssues() {
  const [issues, setIssues] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterWard, setFilterWard] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    async function fetchIssues() {
      try {
        const data = await getComplaints();
        setIssues(data);
      } catch (error) {
        console.error("Error fetching issues", error);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);

  const categories = useMemo(() => Array.from(new Set(issues.map(i => i.category))).filter(Boolean), [issues]);
  const wards = useMemo(() => Array.from(new Set(issues.map(i => i.wardNumber))).sort((a,b) => parseInt(a)-parseInt(b)), [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchSearch = issue.description.toLowerCase().includes(search.toLowerCase()) || 
                          issue.location?.toLowerCase().includes(search.toLowerCase()) ||
                          issue.id?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = filterCategory ? issue.category === filterCategory : true;
      const matchWard = filterWard ? issue.wardNumber === filterWard : true;
      const matchStatus = filterStatus ? issue.status === filterStatus : true;
      
      return matchSearch && matchCategory && matchWard && matchStatus;
    });
  }, [issues, search, filterCategory, filterWard, filterStatus]);

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'RESOLVED') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800"><CheckCircle2 className="w-3.5 h-3.5"/> Resolved</span>;
    }
    if (status === 'IN_PROGRESS') {
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><Activity className="w-3.5 h-3.5"/> In Progress</span>;
    }
    return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Clock className="w-3.5 h-3.5"/> Pending</span>;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-red-900/5 border border-slate-100 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Public Issues Log</h1>
        <p className="text-slate-500 mb-8 max-w-2xl">Transparent portal to track all reported issues, their current status, and resolution progress across wards.</p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search by ID, description or location..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-slate-800"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none text-slate-800"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            value={filterWard}
            onChange={e => setFilterWard(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none text-slate-800"
          >
            <option value="">All Wards</option>
            {wards.map(w => <option key={w} value={w}>Ward {w}</option>)}
          </select>
          <select 
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none text-slate-800"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-red-500" />
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No issues found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredIssues.map((issue, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={issue.id} 
              className="bg-white rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-red-900/10 transition-shadow flex flex-col"
            >
              {issue.photoUrl && (
                <div className="h-48 w-full bg-slate-100 overflow-hidden">
                  <img src={issue.photoUrl} alt="Complaint Attachment" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded uppercase tracking-wider">{issue.category}</span>
                  </div>
                  <StatusBadge status={issue.status} />
                </div>
                
                <h3 className="text-slate-800 font-bold mb-2 line-clamp-2">{issue.description}</h3>
                
                <div className="space-y-2 mt-auto pt-4 border-t border-slate-50">
                  <div className="flex items-start text-sm text-slate-500">
                    <MapPin className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                    <span>Ward {issue.wardNumber} • {issue.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <User className="w-4 h-4 mr-2" />
                    <span className="truncate">{issue.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-mono">
                    <span>ID: {issue.id?.substring(0,6).toUpperCase()}</span>
                    <span>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Activity icon missing in list, let's create a local mock
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
