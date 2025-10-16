"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton'; // Utiliser CustomButton
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Vehicle } from '@/components/vehicles/VehicleColumns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomCard } from '@/components/CustomCard'; // Utiliser CustomCard
import { Skeleton } from '@/components/ui/skeleton'; // Importer Skeleton

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des véhicules:", error.message);
      toast.error("Erreur lors du chargement des véhicules: " + error.message);
      setVehicles([]);
    } else {
      setVehicles(data as Vehicle[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleVehicleAdded = () => {
    fetchVehicles();
    setIsDialogOpen(false); // Ferme la boîte de dialogue après l'ajout
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold text-night-blue">Gestion des Véhicules</h1> {/* Utiliser font-heading et night-blue */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <CustomButton> {/* Utiliser CustomButton */}
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Véhicule
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-night-blue">Ajouter un nouveau véhicule</DialogTitle> {/* Utiliser font-heading et night-blue */}
            </DialogHeader>
            <VehicleForm onSuccess={handleVehicleAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <CustomCard className="p-6"> {/* Utiliser CustomCard */}
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <DataTable columns={columns} data={vehicles} />
        )}
      </CustomCard>
    </div>
  );
};

export default Vehicles;