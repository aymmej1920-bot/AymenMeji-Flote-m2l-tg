"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/CustomCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from "@tanstack/react-table";
import { motion } from 'framer-motion';

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
  const [data, setData] = useState<DriverPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDriverPerformance = async () => {
      setLoading(true);
      const { data: drivers, error: driversError } = await supabase
        .from('drivers')
        .select('id, first_name, last_name');

      if (driversError) {
        console.error("Erreur lors du chargement des conducteurs:", driversError.message);
        toast.error("Erreur lors du chargement des conducteurs: " + driversError.message);
        setLoading(false);
        return;
      }

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
        .select('driver_id');

      if (toursError) {
        console.error("Erreur lors du chargement des tournées:", toursError.message);
        toast.error("Erreur lors du chargement des tournées: " + toursError.message);
      } else {
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
        .select('driver_id');

      if (fuelLogsError) {
        console.error("Erreur lors du chargement des relevés de carburant:", fuelLogsError.message);
        toast.error("Erreur lors du chargement des relevés de carburant: " + fuelLogsError.message);
      } else {
        fuelLogs.forEach(log => {
          if (log.driver_id && driverPerformanceMap.has(log.driver_id)) {
            const driver = driverPerformanceMap.get(log.driver_id)!;
            driver.fuel_logs_count++;
            driverPerformanceMap.set(log.driver_id, driver);
          }
        });
      }

      setData(Array.from(driverPerformanceMap.values()));
      setLoading(false);
    };

    fetchDriverPerformance();
  }, []);

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Performance des Conducteurs</CustomCardTitle>
      </CustomCardHeader>
      <CustomCardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : data.length > 0 ? (
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