import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Droplets, Trash2, Lightbulb, Activity, Construction, MapPin, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  { name: 'Roads', icon: Construction, color: 'text-amber-600', bg: 'bg-amber-100' },
  { name: 'Water Supply', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Drainage', icon: Activity, color: 'text-teal-600', bg: 'bg-teal-100' },
  { name: 'Garbage Collection', icon: Trash2, color: 'text-gray-600', bg: 'bg-gray-100' },
  { name: 'Street Lights', icon: Lightbulb, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { name: 'Encroachment', icon: MapPin, color: 'text-red-500', bg: 'bg-red-100' },
];

export default function Home() {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-[#7a1c1d] text-white shadow-2xl">
        <div className="relative px-6 py-12 sm:py-20 sm:px-12 flex flex-col md:flex-row md:items-center md:justify-between min-h-[400px]">
          {/* Left Content */}
          <div className="md:w-[55%] z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-white/10"
            >
              <Sparkles className="w-4 h-4" /> TVK • மேல்விஷாரம்
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4"
            >
              மேல்விஷாரம் மக்கள் சேவை <br />
              மையம்
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl sm:text-2xl font-medium mb-2"
            >
              Your problem, our responsibility
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-red-100/80 mb-8 max-w-md"
            >
              Report an issue in under 60 seconds. Get faster resolution.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                to="/report"
                className="inline-flex items-center px-6 py-3.5 bg-white text-[#7a1c1d] font-bold rounded-full shadow-lg hover:bg-gray-50 transition-all font-sans"
              >
                <ArrowRight className="mr-2 w-5 h-5" />
                Register Complaint
              </Link>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="md:w-[40%] mt-10 md:mt-0 flex justify-center md:justify-end items-center relative z-0 md:absolute md:right-12 md:top-1/2 md:-translate-y-1/2"
          >
            <img 
              src="/candidate.png" 
              alt="Candidate Profile" 
              className="w-full max-w-[220px] md:max-w-[280px] lg:max-w-[320px] h-auto object-contain drop-shadow-2xl object-center"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Received</p>
            <p className="text-3xl font-black text-slate-800 mt-1">0</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
            <p className="text-3xl font-black text-amber-600 mt-1">0</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
            <p className="text-3xl font-black text-green-600 mt-1">0</p>
          </div>
          <div className="bg-red-50/50 p-5 rounded-2xl shadow-xl shadow-red-900/5 border border-red-100 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs font-bold text-red-800 uppercase tracking-wider">Active Wards</p>
            <p className="text-3xl font-black text-red-700 mt-1">21</p>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-800">Issue Categories</h2>
          <p className="text-slate-500 mt-1">What kind of problem do you want to report?</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link 
              key={cat.name} 
              to={`/report?category=${encodeURIComponent(cat.name)}`}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-red-300 hover:bg-red-50 cursor-pointer group transition-colors"
            >
              <div className={`w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-red-100 transition-colors`}>
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">{cat.name}</h3>
            </Link>
          ))}
          <Link 
            to="/report"
            className="bg-red-600 rounded-xl p-4 flex flex-col items-center justify-center text-center text-white cursor-pointer hover:bg-red-700 shadow-lg shadow-red-200"
          >
            <span className="text-2xl mb-1 mt-1 font-bold">+</span>
            <p className="font-bold text-sm text-white">Report Issue</p>
            <p className="text-[10px] text-red-200 uppercase tracking-tighter">Start Here</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
