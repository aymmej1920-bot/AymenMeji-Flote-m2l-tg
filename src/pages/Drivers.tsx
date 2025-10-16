"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import DriverForm from '@/components/drivers/DriverForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Driver } from '@/components/drivers/DriverColumns';
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

const Drivers: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les conducteurs.");
    }
    return user.id;
  };

  // Fetch drivers using React Query
  const { data: drivers, isLoading, error } = useQuery<Driver[], Error>({
    queryKey: ['drivers'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Driver[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des conducteurs: " + error.message);
    }
  }, [error]);

  // Mutation for deleting a driver
  const deleteDriverMutation = useMutation<void, Error, string>({
    mutationFn: async (driverId: string) => {
      const userId = await getUserId();
      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', driverId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Conducteur supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setDriverToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Erreur lors de la suppression du conducteur:", err.message);
      toast.error("Erreur lors de la suppression du conducteur: " + err.message);
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['drivers'] });
    setIsAddDialogOpen(false);
    setEditingDriver(null);
  };

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDriver = () => {
    if (driverToDelete) {
      deleteDriverMutation.mutate(driverToDelete.id);
    }
  };

  const handleEditClick = (driver: Driver) => {
    setEditingDriver(driver);
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Conducteurs</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingDriver(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingDriver(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Conducteur
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingDriver ? "Modifier le conducteur" : "Ajouter un nouveau conducteur"}
              </DialogTitle>
              <DialogDescription>
                {editingDriver ? "Modifiez les détails du conducteur existant." : "Remplissez les informations pour ajouter un nouveau conducteur."}
              </DialogDescription>
            </DialogHeader>
            <DriverForm onSuccess={handleFormSuccess} initialData={editingDriver || undefined} />
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
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={drivers || []} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le conducteur "{driverToDelete?.first_name} {driverToDelete?.last_name}" de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDriver} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Drivers;