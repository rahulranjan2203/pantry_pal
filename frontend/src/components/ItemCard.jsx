import React from 'react';
import { Trash2, Edit2, Clock, AlertCircle, CheckCircle, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const ItemCard = ({ item, onEdit, onDelete, onSelectIngredient, isSelected }) => {
  
  const calculateDaysLeft = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateString);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const daysLeft = calculateDaysLeft(item.expiryDate);

  // Status Styling Logic
  let status = {
    color: "border-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: <CheckCircle size={14} />,
    text: `${daysLeft} Days`
  };

  if (daysLeft < 0) {
    status = {
      color: "border-red-500",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: <AlertCircle size={14} />,
      text: "Expired"
    };
  } else if (daysLeft === 0) {
    status = {
      color: "border-red-500",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: <AlertCircle size={14} />,
      text: "Expires Today"
    };
  } else if (daysLeft <= 3) {
    status = {
      color: "border-red-500",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: <AlertCircle size={14} />,
      text: `${daysLeft} Days`
    };
  } else if (daysLeft <= 7) {
    status = {
      color: "border-amber-400",
      badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      icon: <Clock size={14} />,
      text: `${daysLeft} Days`
    };
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative group bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300 border-l-[6px] ${status.color} overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex gap-4 mb-3">
          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 text-teal-100 mb-2">
                  {item.category}
                </span>
                <h3 className="font-bold text-lg text-white leading-tight truncate">{item.name}</h3>
              </div>
              
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${status.badge}`}>
                {status.icon}
                {status.text}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center text-sm text-teal-100 gap-2 mt-4 mb-6">
          <Clock size={16} />
          <span className="font-medium">Expires: {new Date(item.expiryDate).toDateString()}</span>
        </div>

        {/* Buttons - Always visible on mobile, hover on desktop */}
        <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-2 md:translate-y-4 md:group-hover:translate-y-0">
          <button 
            onClick={() => onSelectIngredient(item.name)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors flex justify-center items-center gap-2 ${
              isSelected 
                ? 'bg-green-500/80 text-white border border-green-400/50 backdrop-blur-sm' 
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-green-500/20 hover:border-green-400/30'
            }`}
          >
            <ChefHat size={16} /> Cook
          </button>
          <button 
            onClick={() => onEdit(item)}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-500/20 hover:border-teal-400/30 transition-colors flex justify-center items-center gap-2"
          >
            <Edit2 size={16} /> Edit
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/20 hover:border-red-400/30 transition-colors flex justify-center items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;