"use client";

import React, { useState, useEffect } from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import ProgressBar from '@/components/ProgressBar';
import { Car, Users, Wrench, Fuel } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query'; // Import useQuery

interface DashboardStats {
  totalVehicles: number;
  activeDrivers: number;
  maintenanceInProgress: number;
  avgFuelLevel: number;
  operationalVehicles: number;
  plannedMaintenanceDone: number;
}

const Dashboard: React.FC = () => {
  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir le tableau de bord.");
    }
    return user.id;
  };

  const { data: stats, isLoading, error } = useQuery<DashboardStats, Error>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const userId = await getUserId();

      // Fetch total vehicles
      const { count: totalVehiclesCount, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      if (vehiclesError) throw vehiclesError;

      // Fetch active drivers
      const { count: activeDriversCount, error: driversError } = await supabase
        .from('drivers')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'Actif');
      if (driversError) throw driversError;

      // Fetch maintenance in progress
      const { count: maintenanceInProgressCount, error: maintenanceError } = await supabase
        .from('maintenance_records')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'En cours');
      if (maintenanceError) throw maintenanceError;

      // Fetch fuel logs for average fuel level (this is a placeholder, actual fuel level would be more complex)
      const { data: fuelLogs, error: fuelLogsError } = await supabase
        .from('fuel_logs')
        .select('quantity_liters')
        .eq('user_id', userId);
      if (fuelLogsError) throw fuelLogsError;

      // Fetch operational vehicles (placeholder, would need more complex logic)
      const { count: operationalVehiclesCount, error: operationalVehiclesError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'Actif'); // Assuming 'Actif' means operational
      if (operationalVehiclesError) throw operationalVehiclesError;

      // Fetch planned maintenance done (placeholder, would need more complex logic)
      const { count: plannedMaintenanceDoneCount, error: plannedMaintenanceDoneError } = await supabase
        .from('maintenance_records')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('status', 'Terminé'); // Assuming 'Terminé' means done
      if (plannedMaintenanceDoneError) throw plannedMaintenanceDoneError;

      const totalFuelQuantity = fuelLogs?.reduce((sum, log) => sum + log.quantity_liters, 0) || 0;
      const avgFuelLevel = fuelLogs && fuelLogs.length > 0 ? Math.min(100, Math.round((totalFuelQuantity / (fuelLogs.length * 50)) * 100)) : 0; // Assuming average tank size of 50L

      return {
        totalVehicles: totalVehiclesCount || 0,
        activeDrivers: activeDriversCount || 0,
        maintenanceInProgress: maintenanceInProgressCount || 0,
        avgFuelLevel: avgFuelLevel,
        operationalVehicles: operationalVehiclesCount || 0,
        plannedMaintenanceDone: plannedMaintenanceDoneCount || 0,
      };
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des statistiques du tableau de bord: " + error.message);
    }
  }, [error]);

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
              {isLoading ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{stats?.totalVehicles}</div>}
              <p className="text-xs text-muted-foreground">+20% ce mois-ci</p> {/* Placeholder */}
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
              {isLoading ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{stats?.activeDrivers}</div>}
              <p className="text-xs text-muted-foreground">+5% la semaine dernière</p> {/* Placeholder */}
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
              {isLoading ? <Skeleton className="h-7 w-1/2" /> : <div className="text-2xl font-bold">{stats?.maintenanceInProgress}</div>}
              <p className="text-xs text-muted-foreground">2 urgences</p> {/* Placeholder */}
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
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            ) : (
              <>
                <ProgressBar value={stats?.avgFuelLevel || 0} label="Niveau de Carburant Moyen" />
                <ProgressBar value={stats && stats.operationalVehicles > 0 && stats.totalVehicles > 0 ? Math.round((stats.operationalVehicles / stats.totalVehicles) * 100) : 0} label="Véhicules Opérationnels" />
                <ProgressBar value={stats && stats.plannedMaintenanceDone > 0 && stats.totalVehicles > 0 ? Math.round((stats.plannedMaintenanceDone / stats.totalVehicles) * 100) : 0} label="Maintenance Planifiée Effectuée" />
              </>
            )}
          </div>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Dashboard;