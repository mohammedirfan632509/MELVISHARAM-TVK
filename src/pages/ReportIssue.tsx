import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitComplaint } from '../firebase/db';
import { Camera, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

const categories = [
  'Roads', 'Water Supply', 'Drainage', 'Garbage Collection', 
  'Street Lights', 'Sewage', 'Public Health', 'Encroachment', 'Other'
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    wardNumber: '',
    category: initialCategory,
    description: '',
    location: ''
  });
  
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const id = await submitComplaint({
        ...formData
      }, imageFile);
      
      setTicketId(id);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-xl shadow-red-900/5 border border-slate-100 text-center space-y-6 mt-10"
      >
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Complaint Registered!</h2>
        <p className="text-lg text-slate-600">
          Your issue has been successfully reported to the authorities.
        </p>
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-center items-center flex-col shadow-inner">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Tracking ID</span>
          <span className="text-3xl font-mono relative tracking-widest text-red-600 font-bold bg-white px-4 py-2 rounded-lg shadow-sm border border-red-100">
            {ticketId.slice(0, 8).toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Please save this tracking ID for future reference.
        </p>
        <div className="pt-6">
          <button
            onClick={() => navigate('/issues')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold shadow-md transition-all"
          >
            View Public Issues
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Report an Issue</h1>
        <p className="text-slate-500 mt-2 text-lg">No login required. Submit details below to register a complaint.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-red-900/5 overflow-hidden border border-slate-100">
        <div className="h-2 w-full bg-gradient-to-r from-red-500 via-red-600 to-red-800"></div>
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mobileNumber" className="block text-sm font-bold text-slate-700">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                required
                pattern="[0-9]{10}"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="10-digit mobile number"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-bold text-slate-700">Category</label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all appearance-none text-slate-800"
              >
                <option value="" disabled>Select Issue Type</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="wardNumber" className="block text-sm font-bold text-slate-700">Ward Number</label>
              <select
                id="wardNumber"
                name="wardNumber"
                required
                value={formData.wardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all appearance-none text-slate-800"
              >
                <option value="" disabled>Select Ward</option>
                {Array.from({ length: 21 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={String(num)}>Ward {num}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="block text-sm font-bold text-slate-700">Exact Location / Landmark</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="e.g. Near Big Mosque, Main Street"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-bold text-slate-700">Problem Description</label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
              placeholder="Describe the issue in detail..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Upload Photo (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:bg-slate-50 transition-colors bg-white relative overflow-hidden group">
              {imagePreview ? (
                <div className="relative w-full h-48 flex items-center justify-center">
                  <img src={imagePreview} alt="Preview" className="max-h-full object-contain rounded-lg" />
                  <div className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white cursor-pointer hover:bg-black" onClick={(e) => {
                    e.preventDefault();
                    setImageFile(undefined);
                    setImagePreview(null);
                  }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <Camera className="mx-auto h-12 w-12 text-slate-400 group-hover:text-red-500 transition-colors" />
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label
                      htmlFor="photo-upload"
                      className="relative cursor-pointer bg-white rounded-md font-bold text-red-600 hover:text-red-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input id="photo-upload" name="photo-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Submitting Issue...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
