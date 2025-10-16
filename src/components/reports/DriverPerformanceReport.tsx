"use client";

import React, { useEffect } from 'react';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/CustomCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from '@tanstack/react-query'; // Import useQuery

interface DriverPerformance {
  id: string;
  driver_name: string;
  tours_count: number;
  fuel_logs_count: number;
}

const columns: ColumnDef<DriverPerformance>[] = [
  {
    accessorKey: "driver_name",
    header: "Conducteur",
  },
  {
    accessorKey: "tours_count",
    header: "Nombre de Tournées",
  },
  {
    accessorKey: "fuel_logs_count",
    header: "Nombre de Relevés Carburant",
  },
];

const DriverPerformanceReport: React.FC = () => {
  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir la performance des conducteurs.");
    }
    return user.id;
  };

  const { data, isLoading, error } = useQuery<DriverPerformance[], Error>({
    queryKey: ['driverPerformance'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data: drivers, error: driversError } = await supabase
        .from('drivers')
        .select('id, first_name, last_name')
        .eq('user_id', userId);

      if (driversError) throw driversError;

      const driverPerformanceMap = new Map<string, DriverPerformance>();

      drivers.forEach(driver => {
        driverPerformanceMap.set(driver.id, {
          id: driver.id,
          driver_name: `${driver.first_name} ${driver.last_name}`,
          tours_count: 0,
          fuel_logs_count: 0,
        });
      });

      // Fetch tours count
      const { data: tours, error: toursError } = await supabase
        .from('tours')
        .select('driver_id')
        .eq('user_id', userId);

      if (toursError) console.error("Erreur lors du chargement des tournées:", toursError.message);
      else {
        tours.forEach(tour => {
          if (tour.driver_id && driverPerformanceMap.has(tour.driver_id)) {
            const driver = driverPerformanceMap.get(tour.driver_id)!;
            driver.tours_count++;
            driverPerformanceMap.set(tour.driver_id, driver);
          }
        });
      }

      // Fetch fuel logs count
      const { data: fuelLogs, error: fuelLogsError } = await supabase
        .from('fuel_logs')
        .select('driver_id')
        .eq('user_id', userId);

      if (fuelLogsError) console.error("Erreur lors du chargement des relevés de carburant:", fuelLogsError.message);
      else {
        fuelLogs.forEach(log => {
          if (log.driver_id && driverPerformanceMap.has(log.driver_id)) {
            const driver = driverPerformanceMap.get(log.driver_id)!;
            driver.fuel_logs_count++;
            driverPerformanceMap.set(log.driver_id, driver);
          }
        });
      }

      return Array.from(driverPerformanceMap.values());
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement de la performance des conducteurs: " + error.message);
    }
  }, [error]);

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Performance des Conducteurs</CustomCardTitle>
      </CustomCardHeader>
      <CustomCardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data && data.length > 0 ? (
          <DataTable columns={columns} data={data} />
        ) : (
          <div className="h-[150px] flex items-center justify-center text-muted-foreground">
            Aucune donnée de performance des conducteurs disponible pour le moment.
          </div>
        )}
      </CustomCardContent>
    </CustomCard>
  );
};

export default DriverPerformanceReport;