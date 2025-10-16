"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InspectionForm from '@/components/inspections/InspectionForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Inspection } from '@/components/inspections/InspectionColumns';
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

const Inspections: React.FC = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);
  const [inspectionToDelete, setInspectionToDelete] = useState<Inspection | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchInspections = async () => {
    setLoading(true);
    const { data: { user } } = await auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour voir les inspections.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('user_id', user.id) // Filter by user_id
      .order('inspection_date', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des inspections:", error.message);
      toast.error("Erreur lors du chargement des inspections: " + error.message);
      setInspections([]);
    } else {
      setInspections(data as Inspection[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInspections();
  }, []);

  const handleFormSuccess = () => {
    fetchInspections();
    setIsAddDialogOpen(false);
    setEditingInspection(null);
  };

  const handleDeleteClick = (inspection: Inspection) => {
    setInspectionToDelete(inspection);
    setShowDeleteDialog(true);
  };

  const confirmDeleteInspection = async () => {
    if (inspectionToDelete) {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      const { error } = await supabase
        .from('inspections')
        .delete()
        .eq('id', inspectionToDelete.id)
        .eq('user_id', user.id); // Ensure user owns the record

      if (error) {
        console.error("Erreur lors de la suppression de l'inspection:", error.message);
        toast.error("Erreur lors de la suppression de l'inspection: " + error.message);
      } else {
        toast.success("Inspection supprimée avec succès !");
        fetchInspections();
      }
      setInspectionToDelete(null);
      setShowDeleteDialog(false);
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
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={inspections} />
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