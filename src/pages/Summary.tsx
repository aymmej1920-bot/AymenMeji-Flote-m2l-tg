"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent, CustomCardDescription } from '@/components/CustomCard';
import { motion } from 'framer-motion';
import { Truck, Users, Route, Map } from 'lucide-react';

const Summary: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-main-text" // Use main-text color
      >
        Résumé Général
      </motion.h1>

      {/* KPIs Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <CustomCard className="bg-gradient-to-br from-kpi-blue-start to-kpi-blue-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-blue-100 text-sm font-medium">Total Véhicules</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryTotalVehicles">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <Truck className="text-3xl text-blue-200" />
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-green-start to-kpi-green-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-green-100 text-sm font-medium">Conducteurs Actifs</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryActiveDrivers">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <Users className="text-3xl text-green-200" />
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-orange-start to-kpi-orange-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-orange-100 text-sm font-medium">Tournées ce mois</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryToursMonth">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <Route className="text-3xl text-orange-200" />
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-purple-start to-kpi-purple-end text-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-purple-100 text-sm font-medium">Distance Totale</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryTotalDistance">0</CustomCardTitle> {/* Dynamic content */}
              <CustomCardDescription className="text-purple-100 text-xs">km ce mois</CustomCardDescription>
            </div>
            <Map className="text-3xl text-purple-200" />
          </div>
        </CustomCard>
      </div>

      {/* Charts de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">Performance Mensuelle</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent>
            <div className="chart-container h-[320px]">
              <canvas id="performanceChart"></canvas> {/* Chart will be rendered here */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">Répartition des Coûts (TND)</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent>
            <div className="chart-container h-[320px]">
              <canvas id="costBreakdownChart"></canvas> {/* Chart will be rendered here */}
            </div>
          </CustomCardContent>
        </CustomCard>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">Statistiques Carburant</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="text-secondary-text">Consommation moyenne:</span> {/* Use secondary-text color */}
                <span className="font-semibold">0 L/100km</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-secondary-text">Coût mensuel:</span> {/* Use secondary-text color */}
                <span className="font-semibold">0 TND</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-secondary-text">Économies possibles:</span> {/* Use secondary-text color */}
                <span className="font-semibold text-green-600">0%</span> {/* Dynamic content */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">Maintenance</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="text-secondary-text">Véhicules en maintenance:</span> {/* Use secondary-text color */}
                <span className="font-semibold text-red-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-secondary-text">Vidanges prévues:</span> {/* Use secondary-text color */}
                <span className="font-semibold text-orange-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-secondary-text">Coût maintenance:</span> {/* Use secondary-text color */}
                <span className="font-semibold">0 TND</span> {/* Dynamic content */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl shadow-card-float p-6"> {/* Use new card shadow */}
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-main-text">Documents</CustomCardTitle> {/* Use main-text color */}
          </CustomCardHeader>
          <CustomCardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="text-secondary-text">Expiration &lt; 30j:</span> {/* Use secondary-text color */}
                <span className="font-semibold text-red-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-secondary-text">À renouveler:</span> {/* Use secondary-text color */}
                <span className="font-semibold text-orange-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-secondary-text">À jour:</span> {/* Use secondary-text color */}
                <span className="font-semibold text-green-600">0</span> {/* Dynamic content */}
            </div>
          </CustomCardContent>
        </CustomCard>
      </div>
    </div>
  );
};

export default Summary;