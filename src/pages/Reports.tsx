"use client";

import React, { useEffect } from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import MonthlyFuelCostChart from '@/components/reports/MonthlyFuelCostChart';
import MonthlyMaintenanceCostChart from '@/components/reports/MonthlyMaintenanceCostChart';
import DriverPerformanceReport from '@/components/reports/DriverPerformanceReport';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query'; // Import useQuery

const Reports: React.FC = () => {
  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les rapports.");
    }
    return user.id;
  };

  // Fetch total fuel cost
  const { data: totalFuelCost, isLoading: isLoadingFuelCost, error: fuelCostError } = useQuery<number, Error>({
    queryKey: ['totalFuelCost'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('fuel_logs')
        .select('cost')
        .eq('user_id', userId);
      if (error) throw error;
      return data.reduce((sum, log) => sum + log.cost, 0);
    },
  });

  // Fetch maintenance trends (placeholder for now, more complex logic needed)
  const { data: maintenanceTrends, isLoading: isLoadingMaintenanceTrends, error: maintenanceTrendsError } = useQuery<string, Error>({
    queryKey: ['maintenanceTrends'],
    queryFn: async () => {
      const userId = await getUserId();
      const { count, error } = await supabase
        .from('maintenance_records')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'En cours'); // Example: count ongoing maintenance
      if (error) throw error;
      return count ? `${count} interventions en cours` : "Stable";
    },
  });

  // Fetch vehicle utilization (placeholder for now, more complex logic needed)
  const { data: vehicleUtilization, isLoading: isLoadingVehicleUtilization, error: vehicleUtilizationError } = useQuery<string, Error>({
    queryKey: ['vehicleUtilization'],
    queryFn: async () => {
      const userId = await getUserId();
      const { count: totalVehicles, error: totalVehiclesError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      if (totalVehiclesError) throw totalVehiclesError;

      const { count: activeVehicles, error: activeVehiclesError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'Actif');
      if (activeVehiclesError) throw activeVehiclesError;

      if (totalVehicles && totalVehicles > 0) {
        const utilization = Math.round(((activeVehicles || 0) / totalVehicles) * 100);
        return `${utilization}%`;
      }
      return "N/A";
    },
  });

  useEffect(() => {
    if (fuelCostError) toast.error("Erreur lors du chargement du coût total du carburant: " + fuelCostError.message);
    if (maintenanceTrendsError) toast.error("Erreur lors du chargement des tendances de maintenance: " + maintenanceTrendsError.message);
    if (vehicleUtilizationError) toast.error("Erreur lors du chargement de l'utilisation des véhicules: " + vehicleUtilizationError.message);
  }, [fuelCostError, maintenanceTrendsError, vehicleUtilizationError]);

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
              {isLoadingFuelCost ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">€{totalFuelCost?.toFixed(2) || '0.00'}</div>}
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
              {isLoadingMaintenanceTrends ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{maintenanceTrends}</div>}
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
              {isLoadingVehicleUtilization ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{vehicleUtilization}</div>}
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