"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Vehicle } from '@/components/vehicles/VehicleColumns';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { CustomCard } from '@/components/CustomCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks

const Vehicles: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les véhicules.");
    }
    console.log("Authenticated user ID:", user?.id); // Log user ID
    return user?.id;
  };

  // Fetch vehicles using React Query
  const { data: vehicles, isLoading, error } = useQuery<Vehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID is not available.");
      }
      const selectString = 'id,make,model,year,license_plate,vin,mileage,fuel_type,status,created_at,next_maintenance_date,user_id';
      console.log("Supabase select string for vehicles:", selectString); // Log select string

      const { data, error } = await supabase
        .from('vehicles')
        .select(selectString)
        .eq('user_id', userId)
        .order('created_at', { ascending: false }); // Keep order for now, but simplified select

      if (error) throw error;
      return data as Vehicle[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des véhicules: " + error.message);
    }
  }, [error]);

  // Mutation for deleting a vehicle
  const deleteVehicleMutation = useMutation<void, Error, string>({
    mutationFn: async (vehicleId: string) => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID is not available.");
      }
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Véhicule supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ['vehicles'] }); // Invalidate cache to refetch
      setVehicleToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Erreur lors de la suppression du véhicule:", err.message);
      toast.error("Erreur lors de la suppression du véhicule: " + err.message);
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    setIsAddDialogOpen(false);
    setEditingVehicle(null);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteDialog(true);
  };

  const confirmDeleteVehicle = () => {
    if (vehicleToDelete) {
      deleteVehicleMutation.mutate(vehicleToDelete.id);
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Véhicules</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingVehicle(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingVehicle(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Véhicule
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingVehicle ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}
              </DialogTitle>
              <DialogDescription>
                {editingVehicle ? "Modifiez les détails du véhicule existant." : "Remplissez les informations pour ajouter un nouveau véhicule à votre flotte."}
              </DialogDescription>
            </DialogHeader>
            <VehicleForm onSuccess={handleFormSuccess} initialData={editingVehicle || undefined} />
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CustomCard className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={vehicles || []} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le véhicule "{vehicleToDelete?.make} {vehicleToDelete?.model}" de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteVehicle} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Vehicles;