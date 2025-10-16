"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent, CustomCardDescription } from '@/components/CustomCard'; // Added CustomCardDescription
import { motion } from 'framer-motion';
import { Truck, Users, Route, Map } from 'lucide-react'; // Corrected icon: Map

const Summary: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-gray-800"
      >
        Résumé Général
      </motion.h1>

      {/* KPIs Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <CustomCard className="bg-gradient-to-br from-kpi-blue-start to-kpi-blue-end text-white rounded-xl professional-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-blue-100 text-sm font-medium">Total Véhicules</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryTotalVehicles">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <Truck className="text-3xl text-blue-200" />
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-green-start to-kpi-green-end text-white rounded-xl professional-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-green-100 text-sm font-medium">Conducteurs Actifs</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryActiveDrivers">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <Users className="text-3xl text-green-200" />
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-orange-start to-kpi-orange-end text-white rounded-xl professional-shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <CustomCardDescription className="text-orange-100 text-sm font-medium">Tournées ce mois</CustomCardDescription>
              <CustomCardTitle className="text-3xl font-bold text-white" id="summaryToursMonth">0</CustomCardTitle> {/* Dynamic content */}
            </div>
            <Route className="text-3xl text-orange-200" />
          </div>
        </CustomCard>

        <CustomCard className="bg-gradient-to-br from-kpi-purple-start to-kpi-purple-end text-white rounded-xl professional-shadow p-6">
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
        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-gray-800">Performance Mensuelle</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent>
            <div className="chart-container h-[320px]">
              <canvas id="performanceChart"></canvas> {/* Chart will be rendered here */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-gray-800">Répartition des Coûts (TND)</CustomCardTitle>
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
        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-gray-800">Statistiques Carburant</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="text-gray-600">Consommation moyenne:</span>
                <span className="font-semibold">0 L/100km</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Coût mensuel:</span>
                <span className="font-semibold">0 TND</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Économies possibles:</span>
                <span className="font-semibold text-green-600">0%</span> {/* Dynamic content */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-gray-800">Maintenance</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="text-gray-600">Véhicules en maintenance:</span>
                <span className="font-semibold text-red-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Vidanges prévues:</span>
                <span className="font-semibold text-orange-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">Coût maintenance:</span>
                <span className="font-semibold">0 TND</span> {/* Dynamic content */}
            </div>
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl professional-shadow p-6">
          <CustomCardHeader className="pb-4">
            <CustomCardTitle className="text-xl font-semibold text-gray-800">Documents</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent className="space-y-4">
            <div className="flex justify-between">
                <span className="text-gray-600">Expiration &lt; 30j:</span>
                <span className="font-semibold text-red-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">À renouveler:</span>
                <span className="font-semibold text-orange-600">0</span> {/* Dynamic content */}
            </div>
            <div className="flex justify-between">
                <span className="text-gray-600">À jour:</span>
                <span className="font-semibold text-green-600">0</span> {/* Dynamic content */}
            </div>
          </CustomCardContent>
        </CustomCard>
      </div>
    </div>
  );
};

export default Summary;