"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent, CustomCardDescription } from '@/components/CustomCard';
import { motion } from 'framer-motion';
import { Car, CheckCircle, Route, Wrench } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-heading font-bold text-main-text" // Use main-text color
      >
        Tableau de Bord
      </motion.h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <CustomCard className="bg-gradient-to-br from-kpi-blue-start to-kpi-blue-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-blue-100 text-sm font-medium">Véhicules Total</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="totalVehicles">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Car className="text-2xl" />
            </div>
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-green-start to-kpi-green-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-green-100 text-sm font-medium">Disponibles</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="availableVehicles">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <CheckCircle className="text-2xl" />
            </div>
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-orange-start to-kpi-orange-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-orange-100 text-sm font-medium">En Mission</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="inMissionVehicles">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Route className="text-orange-800 text-2xl" />
            </div>
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-red-start to-kpi-red-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-red-100 text-sm font-medium">Maintenance</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="maintenanceVehicles">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Wrench className="text-2xl" />
            </div>
          </div>
        </CustomCard>
      </div>

      {/* High Consumption Alert (placeholder) */}
      <div id="highConsumptionAlert" className="mb-8" style={{ display: 'none' }}>
        {/* Content will be dynamically generated */}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">État des Véhicules</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent>
            <div className="chart-container h-[320px]">
              <canvas id="vehicleStatusChart"></canvas> {/* Chart will be rendered here */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">Consommation Mensuelle (TND)</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent>
            <div className="chart-container h-[320px]">
              <canvas id="fuelConsumptionChart"></canvas> {/* Chart will be rendered here */}
            </div>
          </CustomCardContent>
        </CustomCard>
      </div>
    </div>
  );
};

export default Dashboard;