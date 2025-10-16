"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import MaintenanceForm from '@/components/maintenance/MaintenanceForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, MaintenanceRecord } from '@/components/maintenance/MaintenanceColumns';
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

const Maintenance: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<MaintenanceRecord | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchMaintenanceRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .order('maintenance_date', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des enregistrements de maintenance:", error.message);
      toast.error("Erreur lors du chargement des enregistrements de maintenance: " + error.message);
      setRecords([]);
    } else {
      setRecords(data as MaintenanceRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMaintenanceRecords();
  }, []);

  const handleFormSuccess = () => {
    fetchMaintenanceRecords();
    setIsAddDialogOpen(false);
    setEditingRecord(null);
  };

  const handleDeleteClick = (record: MaintenanceRecord) => {
    setRecordToDelete(record);
    setShowDeleteDialog(true);
  };

  const confirmDeleteRecord = async () => {
    if (recordToDelete) {
      const { error } = await supabase
        .from('maintenance_records')
        .delete()
        .eq('id', recordToDelete.id);

      if (error) {
        console.error("Erreur lors de la suppression de l'enregistrement:", error.message);
        toast.error("Erreur lors de la suppression de l'enregistrement: " + error.message);
      } else {
        toast.success("Enregistrement de maintenance supprimé avec succès !");
        fetchMaintenanceRecords();
      }
      setRecordToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleEditClick = (record: MaintenanceRecord) => {
    setEditingRecord(record);
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion de la Maintenance</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingRecord(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingRecord(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Enregistrement
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingRecord ? "Modifier l'enregistrement de maintenance" : "Ajouter un nouvel enregistrement de maintenance"}
              </DialogTitle>
            </DialogHeader>
            <MaintenanceForm onSuccess={handleFormSuccess} initialData={editingRecord || undefined} />
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
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={records} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'enregistrement de maintenance "{recordToDelete?.description}" de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteRecord} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Maintenance;