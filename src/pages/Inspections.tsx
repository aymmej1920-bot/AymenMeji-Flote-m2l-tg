"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import InspectionForm from '@/components/inspections/InspectionForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Inspection } from '@/components/inspections/InspectionColumns';
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

const Inspections: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);
  const [inspectionToDelete, setInspectionToDelete] = useState<Inspection | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les inspections.");
    }
    console.log("Inspections Page: Authenticated user ID:", user?.id);
    return user?.id;
  };

  // Fetch inspections using React Query
  const { data: inspections, isLoading, error } = useQuery<Inspection[], Error>({
    queryKey: ['inspections'],
    queryFn: async () => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID is not available.");
      }
      const selectString = 'id,vehicle_id,driver_id,inspection_date,inspection_type,status,notes,created_at,user_id';
      console.log("Inspections Page: Supabase select string for inspections:", selectString);

      const { data, error } = await supabase
        .from('inspections')
        .select(selectString)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Inspection[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des inspections: " + error.message);
    }
  }, [error]);

  // Mutation for deleting an inspection
  const deleteInspectionMutation = useMutation<void, Error, string>({
    mutationFn: async (inspectionId: string) => {
      const userId = await getUserId();
      if (!userId) {
        throw new Error("User ID is not available.");
      }
      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', inspectionId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Inspection supprimée avec succès !");
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      setInspectionToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Erreur lors de la suppression de l'inspection:", err.message);
      toast.error("Erreur lors de la suppression de l'inspection: " + err.message);
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['inspections'] });
    setIsAddDialogOpen(false);
    setEditingInspection(null);
  };

  const handleDeleteClick = (inspection: Inspection) => {
    setInspectionToDelete(inspection);
    setShowDeleteDialog(true);
  };

  const confirmDeleteInspection = () => {
    if (inspectionToDelete) {
      deleteInspectionMutation.mutate(inspectionToDelete.id);
    }
  };

  const handleEditClick = (inspection: Inspection) => {
    setEditingInspection(inspection);
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Inspections</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingInspection(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingInspection(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Inspection
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingInspection ? "Modifier l'inspection" : "Ajouter une nouvelle inspection"}
              </DialogTitle>
              <DialogDescription>
                {editingInspection ? "Modifiez les détails de l'inspection existante." : "Remplissez les informations pour ajouter une nouvelle inspection."}
              </DialogDescription>
            </DialogHeader>
            <InspectionForm onSuccess={handleFormSuccess} initialData={editingInspection || undefined} />
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
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={inspections || []} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'inspection du {inspectionToDelete?.inspection_date} de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteInspection} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inspections;