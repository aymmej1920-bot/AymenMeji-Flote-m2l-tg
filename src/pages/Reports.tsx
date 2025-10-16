"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import MonthlyFuelCostChart from '@/components/reports/MonthlyFuelCostChart';
import MonthlyMaintenanceCostChart from '@/components/reports/MonthlyMaintenanceCostChart'; // Import new chart
import DriverPerformanceReport from '@/components/reports/DriverPerformanceReport'; // Import new report

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-heading font-bold text-foreground"
      >
        Rapports et Analyses
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <CustomCard>
            <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CustomCardTitle className="text-sm font-medium">Coût Total Carburant</CustomCardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-2xl font-bold">€12,345.67</div>
              <p className="text-xs text-muted-foreground">+8% par rapport au mois dernier</p>
            </CustomCardContent>
          </CustomCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <CustomCard>
            <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CustomCardTitle className="text-sm font-medium">Tendances de Maintenance</CustomCardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-2xl font-bold">Stable</div>
              <p className="text-xs text-muted-foreground">3 interventions urgentes ce trimestre</p>
            </CustomCardContent>
          </CustomCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <CustomCard>
            <CustomCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CustomCardTitle className="text-sm font-medium">Utilisation des Véhicules</CustomCardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CustomCardHeader>
            <CustomCardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Optimisation possible sur 2 véhicules</p>
            </CustomCardContent>
          </CustomCard>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <MonthlyFuelCostChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <MonthlyMaintenanceCostChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <DriverPerformanceReport />
      </motion.div>
    </div>
  );
};

export default Reports;