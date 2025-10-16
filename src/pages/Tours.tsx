"use client";

import React from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Tours: React.FC = () => {
  const handleAddTour = () => {
    // Logic to open add tour modal/form
    console.log("Ajouter une tournée");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-main-text" // Use main-text color
        >
          Suivi des Tournées Avancé
        </motion.h1>
        <CustomButton onClick={handleAddTour} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300"> {/* Use gradient and new shadow */}
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Tournée
        </CustomButton>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6" // Use new card shadow
      >
        <p className="text-secondary-text"> {/* Use secondary-text color */}
          Tableau des tournées à venir ici.
        </p>
      </motion.div>
    </div>
  );
};

export default Tours;