"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-heading font-bold text-foreground"
      >
        Tableau de Bord
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CustomCard className="p-6">
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl">Bienvenue sur votre Tableau de Bord !</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent>
            <p className="text-muted-foreground">
              Ceci est une page de tableau de bord minimale. Vous pouvez commencer à ajouter vos widgets et statistiques ici.
            </p>
          </CustomCardContent>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Dashboard;