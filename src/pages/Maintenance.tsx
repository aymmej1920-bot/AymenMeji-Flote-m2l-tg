"use client";

import React from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Droplet, CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardDescription } from '@/components/CustomCard';

const Maintenance: React.FC = () => {
  const handleAddMaintenanceEntry = () => {
    // Logic to open add maintenance entry modal/form
    console.log("Ajouter maintenance");
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
          Suivi Maintenance & Vidanges
        </motion.h1>
        <CustomButton onClick={handleAddMaintenanceEntry} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300"> {/* Use gradient and new shadow */}
          <Plus className="mr-2 h-4 w-4" /> Ajouter Maintenance
        </CustomButton>
      </div>

      {/* Alertes maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <CustomCard className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg shadow-card-float"> {/* Use new card shadow */}
          <CustomCardHeader>
            <div className="flex items-center">
              <Droplet className="text-orange-400 text-2xl mr-4" />
              <div>
                <CustomCardTitle className="text-lg font-semibold text-orange-700">Vidanges à Prévoir</CustomCardTitle>
                <CustomCardDescription className="text-orange-600" id="upcomingMaintenance">3 véhicules approchent des 10,000 km</CustomCardDescription> {/* Dynamic content */}
              </div>
            </div>
          </CustomCardHeader>
        </CustomCard>

        <CustomCard className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg shadow-card-float maintenance-alert"> {/* Use new card shadow */}
          <CustomCardHeader>
            <div className="flex items-center">
              <CircleAlert className="text-red-400 text-2xl mr-4" />
              <div>
                <CustomCardTitle className="text-lg font-semibold text-red-700">Maintenance Urgente</CustomCardTitle>
                <CustomCardDescription className="text-red-600" id="urgentMaintenance">1 véhicule dépasse les limites</CustomCardDescription> {/* Dynamic content */}
              </div>
            </div>
          </CustomCardHeader>
        </CustomCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6" // Use new card shadow
      >
        <p className="text-secondary-text"> {/* Use secondary-text color */}
          Tableau des maintenances à venir ici.
        </p>
      </motion.div>
    </div>
  );
};

export default Maintenance;