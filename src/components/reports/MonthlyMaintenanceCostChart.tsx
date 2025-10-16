"use client";

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/CustomCard';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthlyMaintenanceData {
  month: string;
  cost: number;
}

const MonthlyMaintenanceCostChart: React.FC = () => {
  const [data, setData] = useState<MonthlyMaintenanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenanceCosts = async () => {
      setLoading(true);
      const { data: maintenanceRecords, error } = await supabase
        .from('maintenance_records')
        .select('maintenance_date, cost')
        .order('maintenance_date', { ascending: true });

      if (error) {
        console.error("Erreur lors du chargement des enregistrements de maintenance pour le rapport:", error.message);
        toast.error("Erreur lors du chargement des données de maintenance: " + error.message);
        setData([]);
      } else {
        const monthlyDataMap = new Map<string, number>();

        maintenanceRecords.forEach(record => {
          if (record.cost) { // Only include records with a cost
            const date = parseISO(record.maintenance_date);
            const monthKey = format(date, 'yyyy-MM', { locale: fr }); // e.g., "2023-01"
            const currentCost = monthlyDataMap.get(monthKey) || 0;
            monthlyDataMap.set(monthKey, currentCost + record.cost);
          }
        });

        const processedData = Array.from(monthlyDataMap.entries())
          .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
          .map(([monthKey, cost]) => ({
            month: format(parseISO(monthKey + '-01'), 'MMM yyyy', { locale: fr }), // Format for display e.g., "Jan 2023"
            cost: parseFloat(cost.toFixed(2)),
          }));
        
        setData(processedData);
      }
      setLoading(false);
    };

    fetchMaintenanceCosts();
  }, []);

  return (
    <CustomCard>
      <CustomCardHeader>
        <CustomCardTitle>Coût Mensuel de la Maintenance</CustomCardTitle>
      </CustomCardHeader>
      <CustomCardContent>
        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-full w-full" />
          </div>
        ) : data.length > 0 ? (
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