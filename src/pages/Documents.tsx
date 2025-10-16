"use client";

import React from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, TriangleAlert } from 'lucide-react'; // Corrected icon: TriangleAlert
import { motion } from 'framer-motion';
import { CustomCard } from '@/components/CustomCard';

const Documents: React.FC = () => {
  const handleAddDocument = () => {
    // Logic to open add document modal/form
    console.log("Ajouter un document");
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
          Suivi des Documents
        </motion.h1>
        <CustomButton onClick={handleAddDocument} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg professional-shadow transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> Ajouter Document
        </CustomButton>
      </div>

      {/* Alerts (placeholder) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <CustomCard className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg professional-shadow alert-expire">
          <div className="flex items-center">
            <TriangleAlert className="text-red-400 mr-3 h-5 w-5" />
            <span className="text-red-700"><strong>Attention!</strong> 3 documents expirent dans moins de 30 jours.</span>
          </div>
        </CustomCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl professional-shadow overflow-hidden p-6"
      >
        <p className="text-muted-foreground">
          Tableau des documents à venir ici.
        </p>
      </motion.div>
    </div>
  );
};

export default Documents;