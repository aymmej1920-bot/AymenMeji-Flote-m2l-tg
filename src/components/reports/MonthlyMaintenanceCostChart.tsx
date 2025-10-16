"use client";

import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase, auth } from '@/lib/supabase';
import { toast } from "sonner";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/CustomCard';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query'; // Import useQuery

interface MonthlyMaintenanceData {
  month: string;
  cost: number;
}

const MonthlyMaintenanceCostChart: React.FC = () => {
  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les coûts de maintenance.");
    }
    return user.id;
  };

  const { data, isLoading, error } = useQuery<MonthlyMaintenanceData[], Error>({
    queryKey: ['monthlyMaintenanceCosts'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data: maintenanceRecords, error } = await supabase
        .from('maintenance_records')
        .select('maintenance_date,cost')
        .eq('user_id', userId)
        .order('maintenance_date', { ascending: true });

      if (error) throw error;

      const monthlyDataMap = new Map<string, number>();

      maintenanceRecords.forEach(record => {
        if (record.cost) {
          const date = parseISO(record.maintenance_date);
          const monthKey = format(date, 'yyyy-MM', { locale: fr });
          const currentCost = monthlyDataMap.get(monthKey) || 0;
          monthlyDataMap.set(monthKey, currentCost + record.cost);
        }
      });

      return Array.from(monthlyDataMap.entries())
        .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
        .map(([monthKey, cost]) => ({
          month: format(parseISO(monthKey + '-01'), 'MMM yyyy', { locale: fr }),
          cost: parseFloat(cost.toFixed(2)),
        }));
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des données de maintenance: " + error.message);
    }
  }, [error]);

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Coût Mensuel de la Maintenance</CustomCardTitle>
      </CustomCardHeader>
      <CustomCardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis
                tickFormatter={(value) => `${value} €`}
                className="text-xs"
                width={80}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)} €`}
                labelFormatter={(label: string) => `Mois: ${label}`}
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Bar dataKey="cost" fill="hsl(var(--coral))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Aucune donnée de maintenance disponible pour le moment.
          </div>
        )}
      </CustomCardContent>
    </CustomCard>
  );
};

export default MonthlyMaintenanceCostChart;