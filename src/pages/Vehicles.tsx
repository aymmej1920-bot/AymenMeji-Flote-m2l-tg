"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Vehicle } from '@/components/vehicles/VehicleColumns';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
        <h1 className="text-3xl font-bold">Gestion des Véhicules</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
            </DialogHeader>
            <VehicleForm onSuccess={handleVehicleAdded} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        {loading ? (
          <p className="text-muted-foreground">Chargement des véhicules...</p>
        ) : (
          <DataTable columns={columns} data={vehicles} />
        )}
      </div>
    </div>
  );
};

export default Vehicles;