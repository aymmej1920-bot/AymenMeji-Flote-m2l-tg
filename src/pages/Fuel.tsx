"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle, Fuel as FuelIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FuelLogForm from '@/components/fuel/FuelLogForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, FuelLog } from '@/components/fuel/FuelLogColumns';
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

const Fuel: React.FC = () => {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState<FuelLog | null>(null);
  const [fuelLogToDelete, setFuelLogToDelete] = useState<FuelLog | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchFuelLogs = async () => {
    setLoading(true);
    const { data: { user } } = await auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour voir les relevés de carburant.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('fuel_logs')
      .select('*')
      .eq('user_id', user.id) // Filter by user_id
      .order('fill_date', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des relevés de carburant:", error.message);
      toast.error("Erreur lors du chargement des relevés de carburant: " + error.message);
      setFuelLogs([]);
    } else {
      setFuelLogs(data as FuelLog[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFuelLogs();
  }, []);

  const handleFormSuccess = () => {
    fetchFuelLogs();
    setIsAddDialogOpen(false);
    setEditingFuelLog(null);
  };

  const handleDeleteClick = (log: FuelLog) => {
    setFuelLogToDelete(log);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFuelLog = async () => {
    if (fuelLogToDelete) {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      const { error } = await supabase
        .from('fuel_logs')
        .delete()
        .eq('id', fuelLogToDelete.id)
        .eq('user_id', user.id); // Ensure user owns the record

      if (error) {
        console.error("Erreur lors de la suppression du relevé de carburant:", error.message);
        toast.error("Erreur lors de la suppression du relevé de carburant: " + error.message);
      } else {
        toast.success("Relevé de carburant supprimé avec succès !");
        fetchFuelLogs();
      }
      setFuelLogToDelete(null);
      setShowDeleteDialog(false);
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
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingFuelLog ? "Modifier le relevé de carburant" : "Ajouter un nouveau relevé de carburant"}
              </DialogTitle>
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
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={fuelLogs} />
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