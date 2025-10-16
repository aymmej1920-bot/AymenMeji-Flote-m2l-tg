"use client";

import React from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent, CustomCardDescription } from '@/components/CustomCard'; // Added CustomCardDescription
import { Fuel as FuelIcon, Coins, LineChart } from 'lucide-react'; // Renamed Fuel to FuelIcon

const Fuel: React.FC = () => {
  const handleAddFuelEntry = () => {
    // Logic to open add fuel entry modal/form
    console.log("Ajouter un plein");
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
          Gestion du Carburant
        </motion.h1>
        <CustomButton onClick={handleAddFuelEntry} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg professional-shadow transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" /> Ajouter Plein
        </CustomButton>
      </div>

      {/* Fuel Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader> {/* Used CustomCardHeader */}
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FuelIcon className="text-blue-600 text-2xl" /> {/* Used FuelIcon */}
              </div>
              <div className="ml-4">
                <CustomCardDescription className="text-gray-500 text-sm font-medium">Total Litres</CustomCardDescription>
                <CustomCardTitle className="text-3xl font-bold text-gray-900" id="totalLiters">0</CustomCardTitle> {/* Dynamic content */}
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent> {/* Used CustomCardContent */}
            {/* Additional content if needed */}
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader> {/* Used CustomCardHeader */}
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Coins className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <CustomCardDescription className="text-gray-500 text-sm font-medium">Coût Total</CustomCardDescription>
                <CustomCardTitle className="text-3xl font-bold text-green-600" id="totalFuelCost">0 TND</CustomCardTitle> {/* Dynamic content */}
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent> {/* Used CustomCardContent */}
            {/* Additional content if needed */}
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader> {/* Used CustomCardHeader */}
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <LineChart className="text-orange-600 text-2xl" />
              </div>
              <div className="ml-4">
                <CustomCardDescription className="text-gray-500 text-sm font-medium">Prix Moyen/L</CustomCardDescription>
                <CustomCardTitle className="text-3xl font-bold text-orange-600" id="avgFuelPrice">0 TND</CustomCardTitle> {/* Dynamic content */}
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent> {/* Used CustomCardContent */}
            {/* Additional content if needed */}
          </CustomCardContent>
        </CustomCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl professional-shadow overflow-hidden p-6"
      >
        <p className="text-muted-foreground">
          Tableau des pleins de carburant à venir ici.
        </p>
      </motion.div>
    </div>
  );
};

export default Fuel;