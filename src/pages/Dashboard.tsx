"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import ProgressBar from '@/components/ProgressBar';
import { Car, Users, Wrench, Fuel } from 'lucide-react';
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <CustomCard>
            <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CustomCardTitle className="text-sm font-medium">Total Véhicules</CustomCardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">+20% ce mois-ci</p>
            </CustomCardContent>
          </CustomCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <CustomCard>
            <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CustomCardTitle className="text-sm font-medium">Conducteurs Actifs</CustomCardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-2xl font-bold">18</div>
              <p className="text-xs text-muted-foreground">+5% la semaine dernière</p>
            </CustomCardContent>
          </CustomCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <CustomCard>
            <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CustomCardTitle className="text-sm font-medium">Maintenance en Cours</CustomCardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 urgences</p>
            </CustomCardContent>
          </CustomCard>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <CustomCard className="p-6">
          <CustomCardTitle className="mb-4">Statut Général de la Flotte</CustomCardTitle>
          <div className="space-y-4">
            <ProgressBar value={75} label="Niveau de Carburant Moyen" />
            <ProgressBar value={90} label="Véhicules Opérationnels" />
            <ProgressBar value={40} label="Maintenance Planifiée Effectuée" />
          </div>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Dashboard;