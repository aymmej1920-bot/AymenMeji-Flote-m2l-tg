"use client";

import React from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Drivers: React.FC = () => {
  const handleAddDriver = () => {
    // Logic to open add driver modal/form
    console.log("Ajouter un conducteur");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800"
        >
          Gestion des Conducteurs
        </motion.h1>
        <CustomButton onClick={handleAddDriver} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg professional-shadow transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> Ajouter Conducteur
        </CustomButton>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl professional-shadow overflow-hidden p-6"
      >
        <p className="text-muted-foreground">
          Tableau des conducteurs à venir ici.
        </p>
      </motion.div>
    </div>
  );
};

export default Drivers;