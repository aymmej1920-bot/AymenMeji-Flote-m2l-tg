"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle, Map } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TourForm from '@/components/tours/TourForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Tour } from '@/components/tours/TourColumns';
import { supabase } from '@/lib/supabase';
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

const Tours: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchTours = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tours')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des tournées:", error.message);
      toast.error("Erreur lors du chargement des tournées: " + error.message);
      setTours([]);
    } else {
      setTours(data as Tour[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleFormSuccess = () => {
    fetchTours();
    setIsAddDialogOpen(false);
    setEditingTour(null);
  };

  const handleDeleteClick = (tour: Tour) => {
    setTourToDelete(tour);
    setShowDeleteDialog(true);
  };

  const confirmDeleteTour = async () => {
    if (tourToDelete) {
      const { error } = await supabase
        .from('tours')
        .delete()
        .eq('id', tourToDelete.id);

      if (error) {
        console.error("Erreur lors de la suppression de la tournée:", error.message);
        toast.error("Erreur lors de la suppression de la tournée: " + error.message);
      } else {
        toast.success("Tournée supprimée avec succès !");
        fetchTours();
      }
      setTourToDelete(null);
      setShowDeleteDialog(false);
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
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={tours} />
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