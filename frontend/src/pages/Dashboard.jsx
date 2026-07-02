import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import emailjs from '@emailjs/browser';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import RecipeIdeas from '../components/RecipeIdeas';
import { fetchItems, addItem, updateItem, deleteItem } from '../services/api';
import { Search, Plus, Filter, Loader2, ArrowUpDown } from 'lucide-react';

const Dashboard = ({ onLogout, onGoHome }) => {
  // EmailJS Configuration - Your actual values
  const EMAILJS_SERVICE_ID = 'service_5s7vwbi';
  const EMAILJS_TEMPLATE_ID = 'template_n1x9vys';
  const EMAILJS_PUBLIC_KEY = 'UlBSukizQS9sAiEn-';

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState('expiry-asc');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  // Read username from storage
  const [username, setUsername] = useState("User");

  // Check and notify for expiring items
  const checkAndNotify = async (itemsList) => {
    try {
      // Check if we already sent an email today
      const today = new Date().toDateString();
      const lastEmailSent = localStorage.getItem('lastEmailSentDate');
      
      if (lastEmailSent === today) {
        console.log('Email already sent today, skipping notification');
        return;
      }

      // Filter items expiring within 2 days
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
      
      const expiringItems = itemsList.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);
        twoDaysFromNow.setHours(23, 59, 59, 999);
        
        return expiryDate >= today && expiryDate <= twoDaysFromNow;
      });

      if (expiringItems.length > 0) {
        // Format item names into a string
        const itemNames = expiringItems.map(item => 
          `${item.name} (expires: ${new Date(item.expiryDate).toLocaleDateString()})`
        ).join('\n');

        console.log('Sending email with:', { username, itemNames }); // Debug log

        // Get user's registered email
        const userEmail = localStorage.getItem('userEmail') || 'justmeu2204@gmail.com';
        console.log('Sending email to:', userEmail); // Debug log

        // Email template parameters matching your template
        const templateParams = {
          to_name: username || 'User',
          to_email: userEmail, // Add recipient email
          message: itemNames || 'No items found'
        };

        // Send email using EmailJS
        console.log('Template params:', templateParams); // Debug log
        
        const result = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
        
        console.log('Email sent successfully:', result); // Debug log

        // Mark email as sent today
        localStorage.setItem('lastEmailSentDate', today);
        
        toast.success(`Email notification sent! ${expiringItems.length} items expiring soon.`);
        console.log('Expiry notification email sent successfully');
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
      toast.error('Failed to send email notification');
    }
  };
  // Load initial data
  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    }

    const loadData = async () => {
      try {
        const data = await fetchItems();
        // Sort: Earliest expiry first
        const sortedData = data.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        setItems(sortedData);
        
        // Check for expiring items and send email if needed
        await checkAndNotify(sortedData);
      } catch (err) {
        console.error("Failed to fetch items:", err);
        // If token is invalid, logout
        if (err.message.includes('token') || err.message.includes('401') || err.message.includes('403')) {
          onLogout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- ACTIONS ---

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await deleteItem(id);
        setItems(prevItems => prevItems.filter(item => item.id !== id));
        toast.success("Item deleted successfully!");
      } catch (error) {
        console.error("Failed to delete", error);
        if (error.message.includes('Authentication failed')) {
          onLogout();
        } else {
          toast.error("Failed to delete item. Please try again.");
        }
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (formData) => {
    try {
      if (editingItem) {
        // UPDATE Existing
        const updatedItem = await updateItem(editingItem.id, formData);
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === editingItem.id ? updatedItem : item
          )
        );
        toast.success("Item updated successfully!");
      } else {
        // CREATE New
        const newItem = await addItem(formData);
        // Add new item and re-sort
        setItems(prev => {
          const newList = [newItem, ...prev];
          return newList.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
        });
        toast.success("Item added successfully!");
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save item", error);
      if (error.message.includes('Authentication failed')) {
        onLogout();
      } else {
        toast.error(`Failed to ${editingItem ? 'update' : 'add'} item. Please try again.`);
      }
    }
  };

  const handleSelectIngredient = (itemName) => {
    setSelectedIngredients(prev => {
      if (prev.includes(itemName)) {
        // Remove if already selected
        return prev.filter(ingredient => ingredient !== itemName);
      } else {
        // Add to selection
        return [...prev, itemName];
      }
    });
  };

  // --- FILTERING AND SORTING ---
  const filteredAndSortedItems = items.filter(item => {
    const nameMatch = item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false;
    const categoryMatch = filterCategory === "All" || item.category === filterCategory;
    return nameMatch && categoryMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'expiry-asc':
        return new Date(a.expiryDate) - new Date(b.expiryDate);
      case 'expiry-desc':
        return new Date(b.expiryDate) - new Date(a.expiryDate);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'recent':
        return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
      default:
        return 0;
    }
  });

  const expiringSoonCount = items.filter(i => {
    if (!i.expiryDate) return false;
    const days = Math.ceil((new Date(i.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 3;
  }).length;

  return (
    <>
      <Navbar onLogout={onLogout} username={username} onGoHome={onGoHome} />

      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
        initialData={editingItem}
      />

      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-6">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">My Pantry</h1>
              <p className="text-teal-200 mt-2 text-lg">Manage your inventory smarter.</p>
            </div>

            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex flex-col items-center min-w-[90px]">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">Total</span>
                <span className="text-2xl font-bold text-white">{items.length}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-red-400/30 flex flex-col items-center min-w-[90px]">
                <span className="text-xs font-bold text-red-300 uppercase tracking-wider">Critical</span>
                <span className="text-2xl font-bold text-red-400">{expiringSoonCount}</span>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-10">

            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={20} />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none shadow-xl text-white placeholder-teal-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-300" size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-12 pr-8 py-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none shadow-xl text-white appearance-none cursor-pointer transition-all min-w-[200px]"
              >
                <option value="expiry-asc">Expiry: Earliest First</option>
                <option value="expiry-desc">Expiry: Latest First</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="recent">Recently Added</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-teal-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {["All", "Dairy", "Meat", "Produce", "Grains", "Snacks"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-6 py-3.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    filterCategory === cat
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30"
                      : "bg-white/10 backdrop-blur-md text-teal-100 border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddNewClick}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:shadow-teal-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={22} /> <span className="hidden sm:inline">Add Item</span>
            </button>
            
            {/* Test Email Button */}
            <button
              onClick={() => {
                localStorage.removeItem('lastEmailSentDate');
                checkAndNotify(items);
              }}
              className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/20 text-sm border border-white/20"
            >
              Test Email
            </button>
          </div>

          {/* Content Area */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 size={48} className="text-teal-400 animate-spin mb-4" />
              <p className="text-teal-200 font-medium text-lg">Loading your pantry...</p>
            </div>
          ) : (
            <>
              {filteredAndSortedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedItems.map(item => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEditClick}
                      onDelete={handleDelete}
                      onSelectIngredient={handleSelectIngredient}
                      isSelected={selectedIngredients.includes(item.name)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-3xl border border-dashed border-white/20">
                  <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter size={32} className="text-teal-300" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No items found</h3>
                  <p className="text-teal-200 mt-2 max-w-sm mx-auto">
                    Try adjusting your search or filters, or add a new item to your pantry.
                  </p>
                  <button
                    onClick={handleAddNewClick}
                    className="mt-8 text-teal-300 font-bold hover:text-teal-100 hover:underline"
                  >
                    + Add your first item
                  </button>
                </div>
              )}
            </>
          )}
          
          {/* Recipe Suggestions Section */}
          <div className="mt-12">
            <RecipeIdeas ingredients={selectedIngredients} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;