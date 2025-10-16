"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { Fuel as FuelIcon } from 'lucide-react'; // Renamed to avoid conflict with component name
import { motion } from 'framer-motion';

const Fuel: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-heading font-bold text-foreground"
      >
        Gestion du Carburant
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CustomCard className="p-6 text-center">
          <CustomCardHeader>
            <FuelIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <CustomCardTitle>Page Carburant</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent>
            <p className="text-muted-foreground">
              Cette page est en cours de développement. Revenez bientôt pour suivre la consommation de carburant !
            </p>
          </CustomCardContent>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Fuel;