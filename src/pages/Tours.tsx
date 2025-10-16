"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle, Map } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import TourForm from '@/components/tours/TourForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Tour } from '@/components/tours/TourColumns';
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

const Tours: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les tournées.");
    }
    return user.id;
  };

  // Fetch tours using React Query
  const { data: tours, isLoading, error } = useQuery<Tour[], Error>({
    queryKey: ['tours'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as Tour[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des tournées: " + error.message);
    }
  }, [error]);

  // Mutation for deleting a tour
  const deleteTourMutation = useMutation<void, Error, string>({
    mutationFn: async (tourId: string) => {
      const userId = await getUserId();
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tournée supprimée avec succès !");
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      setTourToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Erreur lors de la suppression de la tournée:", err.message);
      toast.error("Erreur lors de la suppression de la tournée: " + err.message);
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['tours'] });
    setIsAddDialogOpen(false);
    setEditingTour(null);
  };

  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTour = () => {
    if (tourToDelete) {
      deleteTourMutation.mutate(tourToDelete.id);
    }
  };

  const handleEditClick = (tour: Tour) => {
    setEditingTour(tour);
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Tournées</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingTour(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingTour(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter une Tournée
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingTour ? "Modifier la tournée" : "Ajouter une nouvelle tournée"}
              </DialogTitle>
              <DialogDescription>
                {editingTour ? "Modifiez les détails de la tournée existante." : "Remplissez les informations pour ajouter une nouvelle tournée."}
              </DialogDescription>
            </DialogHeader>
            <TourForm onSuccess={handleFormSuccess} initialData={editingTour || undefined} />
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
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={tours || []} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement la tournée "{tourToDelete?.name}" de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTour} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tours;