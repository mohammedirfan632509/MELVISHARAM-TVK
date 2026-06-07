import { useEffect, useState } from 'react';
import { getComplaints, updateComplaintStatus, ComplaintData, ComplaintStatus } from '../firebase/db';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function Admin() {
  const [issues, setIssues] = useState<ComplaintData[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchIssues();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '632509') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center py-24 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Admin Access</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="••••••"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

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

  const handleStatusChange = async (id: string, newStatus: ComplaintStatus) => {
    setUpdating(id);
    try {
      await updateComplaintStatus(id, newStatus);
      await fetchIssues(); // re-fetch after update
    } catch (e) {
      console.error("Failed to update status", e);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-red-900/5 border border-slate-100 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-slate-500 mb-8 max-w-2xl">Manage and update reported issues here.</p>
      </div>

      {issues.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No issues found</h3>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100">
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">ID / Date</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Reporter</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Issue Details</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Photo</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map(issue => (
                <tr key={issue.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">
                    <div className="font-bold text-slate-800">{issue.id?.substring(0,6).toUpperCase()}</div>
                    <div>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    <div className="font-bold text-slate-800">{issue.fullName}</div>
                    <div>{issue.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-red-600 text-xs mb-1 uppercase tracking-wider">{issue.category}</div>
                    <div className="text-slate-800 font-medium whitespace-normal max-w-xs">{issue.description}</div>
                    <div className="text-slate-500 text-xs mt-1">Ward {issue.wardNumber} • {issue.location}</div>
                  </td>
                  <td className="px-6 py-4">
                    {issue.photoUrl ? (
                      <a href={issue.photoUrl} target="_blank" rel="noopener noreferrer">
                        <img src={issue.photoUrl} alt="Attachment" className="w-16 h-16 object-cover rounded shadow-sm border border-slate-200" />
                      </a>
                    ) : (
                      <span className="text-slate-400 text-xs">No photo</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                      issue.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {updating === issue.id ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-400 inline-block" />
                    ) : (
                      <select 
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id!, e.target.value as ComplaintStatus)}
                        className="text-sm bg-white border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
