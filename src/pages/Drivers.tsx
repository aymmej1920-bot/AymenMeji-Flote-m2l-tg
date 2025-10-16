"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DriverForm from '@/components/drivers/DriverForm'; // Import DriverForm
import { DataTable } from '@/components/ui/data-table';
import { columns, Driver } from '@/components/drivers/DriverColumns'; // Import columns and Driver type
import { supabase, auth } from '@/lib/supabase'; // Import auth
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

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [driverToDelete, setDriverToDelete] = useState<Driver | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchDrivers = async () => {
    setLoading(true);
    const { data: { user } } = await auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour voir les conducteurs.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('drivers')
      .select('*')
      .eq('user_id', user.id) // Filter by user_id
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des conducteurs:", error.message);
      toast.error("Erreur lors du chargement des conducteurs: " + error.message);
      setDrivers([]);
    } else {
      setDrivers(data as Driver[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleFormSuccess = () => {
    fetchDrivers();
    setIsAddDialogOpen(false);
    setEditingDriver(null);
  };

  const handleDeleteClick = (driver: Driver) => {
    setDriverToDelete(driver);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDriver = async () => {
    if (driverToDelete) {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      const { error } = await supabase
        .from('drivers')
        .delete()
        .eq('id', driverToDelete.id)
        .eq('user_id', user.id); // Ensure user owns the record

      if (error) {
        console.error("Erreur lors de la suppression du conducteur:", error.message);
        toast.error("Erreur lors de la suppression du conducteur: " + error.message);
      } else {
        toast.success("Conducteur supprimé avec succès !");
        fetchDrivers();
      }
      setDriverToDelete(null);
      setShowDeleteDialog(false);
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
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={drivers} />
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