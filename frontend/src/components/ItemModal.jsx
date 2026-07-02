import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Tag, Type, Edit2, PlusCircle } from 'lucide-react';

const ItemModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy',
    expiryDate: ''
  });

  // Reset or populate form when modal opens
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', category: 'Dairy', expiryDate: '' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData); // Debug log
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      {/* Modal Container with Glassmorphism */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-white/20">
        
        {/* Modal Header - Gradient Background */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? <Edit2 size={20} className="text-teal-100"/> : <PlusCircle size={20} className="text-teal-100"/>}
            {initialData ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-teal-100 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-teal-100 mb-1.5 flex items-center gap-1.5">
              <Type size={16} className="text-teal-400"/> 
              Item Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none text-white placeholder-teal-200 transition-all shadow-sm"
              placeholder="e.g., Milk"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-semibold text-teal-100 mb-1.5 flex items-center gap-1.5">
              <Tag size={16} className="text-teal-400"/> 
              Category
            </label>
            <div className="relative">
              <select
                className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-white appearance-none cursor-pointer shadow-sm"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Produce">Produce</option>
                <option value="Grains">Grains</option>
                <option value="Snacks">Snacks</option>
                <option value="Beverages">Beverages</option>
              </select>
              {/* Custom arrow for select box to ensure it looks good in dark mode */}
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-teal-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-sm font-semibold text-teal-100 mb-1.5 flex items-center gap-1.5">
              <Calendar size={16} className="text-teal-400"/> 
              Expiry Date
            </label>
            <input
              type="date"
              required
              className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-teal-400 outline-none text-white shadow-sm"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-white/20 text-teal-100 rounded-xl hover:bg-white/10 backdrop-blur-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:shadow-teal-500/25 transition-all flex justify-center items-center gap-2"
            >
              <Save size={18} />
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemModal;