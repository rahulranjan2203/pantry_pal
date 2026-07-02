import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ChefHat, TrendingUp, ArrowRight, AlertTriangle, DollarSign, Sparkles } from 'lucide-react';
import PageLayout from '../components/PageLayout';

const LandingPage = ({ onGetStarted }) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <PageLayout type="auth">
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-24"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
              variants={fadeInUp}
            >
              Master Your Kitchen.<br />
              <span className="text-teal-400">Stop Food Waste.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-teal-100 mb-10 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Join the movement to save food, money, and the planet. Track your pantry, get recipe ideas, and receive smart expiry alerts.
            </motion.p>
            
            <motion.button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey <ArrowRight size={20} />
            </motion.button>
          </motion.div>

          {/* The "Why" Section */}
          <motion.div 
            className="mb-20"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold text-white text-center mb-12"
              variants={fadeInUp}
            >
              The Reality We Face
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center flex flex-col justify-center items-center min-h-[300px]"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Reality</h3>
                <p className="text-teal-100 text-sm leading-relaxed px-2">
                  40% of food produced in India is wasted before it reaches the consumer.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center flex flex-col justify-center items-center min-h-[300px]"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Cost</h3>
                <p className="text-teal-100 text-sm leading-relaxed px-2">
                  Every year, Indian households waste 50kg of food per person.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center flex flex-col justify-center items-center min-h-[300px]"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">The Solution</h3>
                <p className="text-teal-100 text-sm leading-relaxed px-2">
                  Smart tracking can reduce household waste by up to 80%.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Inspiration Quote */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <blockquote className="text-2xl md:text-3xl font-light text-white italic leading-relaxed">
                "Respect for food is a respect for life, for who we are and what we do."
              </blockquote>
            </div>
          </motion.div>

          {/* Key Features */}
          <motion.div 
            className="mb-16"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h2 
              className="text-3xl font-bold text-white text-center mb-12"
              variants={fadeInUp}
            >
              Why Choose Pantry Pal?
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center hover:bg-white/15 transition-all duration-300 flex flex-col justify-center items-center min-h-[260px]"
                variants={fadeInUp}
                whileHover={{ y: -3 }}
              >
                <div className="w-16 h-16 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Smart Alerts</h3>
                <p className="text-teal-100 text-sm px-2">
                  Get notified 2 days before expiry.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center hover:bg-white/15 transition-all duration-300 flex flex-col justify-center items-center min-h-[260px]"
                variants={fadeInUp}
                whileHover={{ y: -3 }}
              >
                <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <ChefHat className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Instant Recipes</h3>
                <p className="text-teal-100 text-sm px-2">
                  Cook with what you have.
                </p>
              </motion.div>

              <motion.div 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-lg text-center hover:bg-white/15 transition-all duration-300 flex flex-col justify-center items-center min-h-[260px]"
                variants={fadeInUp}
                whileHover={{ y: -3 }}
              >
                <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Money Saver</h3>
                <p className="text-teal-100 text-sm px-2">
                  Stop buying duplicates.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <p className="text-teal-200 mb-6">
              Ready to transform your kitchen?
            </p>
            <motion.button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-lg font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now <ArrowRight size={20} />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </PageLayout>
  );
};

export default LandingPage;