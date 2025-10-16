"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import FuelLogForm from '@/components/fuel/FuelLogForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, FuelLog } from '@/components/fuel/FuelLogColumns';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Fuel: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState<FuelLog | null>(null);
  const [fuelLogToDelete, setFuelLogToDelete] = useState<FuelLog | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les relevés de carburant.");
    }
    console.log("Fuel Page: Authenticated user ID:", user?.id);
    return user?.id;
  };

  // Fetch fuel logs using React Query
  const { data: fuelLogs, isLoading, error } = useQuery<FuelLog[], Error>({
    queryKey: ['fuelLogs'],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID is not available.");
      }
      const selectString = 'id,vehicle_id,driver_id,fill_date,quantity_liters,cost,odometer_reading,fuel_type,location,notes,created_at,user_id';
      console.log("Fuel Page: Supabase select string for fuel logs:", selectString);

      const { data, error } = await supabase
        .from('fuel_logs')
        .select(selectString)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as FuelLog[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des relevés de carburant: " + error.message);
    }
  }, [error]);

  // Mutation for deleting a fuel log
  const deleteFuelLogMutation = useMutation<void, Error, string>({
    mutationFn: async (logId: string) => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID is not available.");
      }
      const { error } = await supabase
        .from('fuel_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Relevé de carburant supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
      setFuelLogToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Erreur lors de la suppression du relevé de carburant:", err.message);
      toast.error("Erreur lors de la suppression du relevé de carburant: " + err.message);
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
    setIsAddDialogOpen(false);
    setEditingFuelLog(null);
  };

  const handleDeleteClick = (log: FuelLog) => {
    setFuelLogToDelete(log);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFuelLog = () => {
    if (fuelLogToDelete) {
      deleteFuelLogMutation.mutate(fuelLogToDelete.id);
    }
  };

  const handleEditClick = (log: FuelLog) => {
    setEditingFuelLog(log);
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion du Carburant</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingFuelLog(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingFuelLog(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Relevé
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingFuelLog ? "Modifier le relevé de carburant" : "Ajouter un nouveau relevé de carburant"}
              </DialogTitle>
              <DialogDescription>
                {editingFuelLog ? "Modifiez les détails du relevé de carburant existant." : "Remplissez les informations pour ajouter un nouveau relevé de carburant."}
              </DialogDescription>
            </DialogHeader>
            <FuelLogForm onSuccess={handleFormSuccess} initialData={editingFuelLog || undefined} />
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
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={fuelLogs || []} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le relevé de carburant du {fuelLogToDelete?.fill_date} de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFuelLog} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Fuel;