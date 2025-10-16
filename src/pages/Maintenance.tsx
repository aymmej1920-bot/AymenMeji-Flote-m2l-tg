"use client";

import React, { useState } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Edit, Trash2, Droplet, CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useMaintenanceRecords } from '@/hooks/useMaintenanceRecords';
import { useVehicles } from '@/hooks/useVehicles'; // Import useVehicles
import { TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import MaintenanceRecordForm from '@/components/maintenance/MaintenanceRecordForm';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardDescription } from '@/components/CustomCard';

import type { MaintenanceRecord } from '@/hooks/useMaintenanceRecords';
import type { MaintenanceRecordFormValues } from '@/components/maintenance/MaintenanceRecordForm';

const Maintenance: React.FC = () => {
  const { maintenanceRecords, isLoading, error, addMaintenanceRecord, updateMaintenanceRecord, deleteMaintenanceRecord, addMaintenanceRecordIsLoading, updateMaintenanceRecordIsLoading } = useMaintenanceRecords();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaintenanceRecord, setEditingMaintenanceRecord] = useState<MaintenanceRecord | null>(null);

  const handleAddMaintenanceEntry = () => {
    setEditingMaintenanceRecord(null);
    setIsFormOpen(true);
  };

  const handleEditMaintenanceEntry = (record: MaintenanceRecord) => {
    setEditingMaintenanceRecord(record);
    setIsFormOpen(true);
  };

  const handleDeleteMaintenanceEntry = (id: string) => {
    deleteMaintenanceRecord(id);
  };

  const handleSubmitForm = (data: MaintenanceRecordFormValues & { id?: string }) => {
    if (data.id) {
      updateMaintenanceRecord(data as TablesUpdate<'maintenance_records'> & { id: string });
    } else {
      const { id, ...insertData } = data;
      addMaintenanceRecord(insertData as Omit<TablesInsert<'maintenance_records'>, 'user_id'>);
    }
    setIsFormOpen(false);
  };

  const columns: ColumnDef<MaintenanceRecord>[] = [
    {
      accessorKey: 'date',
      header: "Date",
      cell: ({ row }) => new Date(row.getValue('date') as string).toLocaleDateString(),
    },
    {
      accessorKey: 'vehicles', // Changed accessorKey to the object itself
      header: "Véhicule",
      cell: ({ row }) => (row.original.vehicles ? row.original.vehicles.plate : 'N/A'), // Access plate from the nested object
    },
    {
      accessorKey: 'type',
      header: "Type de maintenance",
    },
    {
      accessorKey: 'mileage',
      header: "Kilométrage",
      cell: ({ row }) => `${row.getValue('mileage')} km`,
    },
    {
      accessorKey: 'cost',
      header: "Coût",
      cell: ({ row }) => `${(row.getValue('cost') as number).toFixed(2)} TND`,
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CustomButton variant="outline" size="sm" onClick={() => handleEditMaintenanceEntry(row.original)}>
            <Edit className="h-4 w-4 mr-2" /> Modifier
          </CustomButton>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <CustomButton variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" /> Supprimer
              </CustomButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action ne peut pas être annulée. Cela supprimera définitivement l'enregistrement de maintenance du{' '}
                  <span className="font-semibold">{new Date(row.original.date).toLocaleDateString()}</span> pour le type{' '}
                  <span className="font-semibold">{row.original.type}</span> de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteMaintenanceEntry(row.original.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  // Placeholder for upcoming maintenance and urgent maintenance logic
  const upcomingOilChanges = maintenanceRecords?.filter(record => record.type === 'Vidange' && record.mileage % 10000 > 8000).length || 0;
  const urgentMaintenance = maintenanceRecords?.filter(record => record.type === 'Réparation' && new Date(record.date).getFullYear() === new Date().getFullYear() && new Date().getMonth() - new Date(record.date).getMonth() > 6).length || 0; // Example: repairs older than 6 months

  if (isLoading || vehiclesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="space-y-4 w-full max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-main-text"
          >
            Chargement des Enregistrements de Maintenance...
          </motion.h1>
        </div>
      </div>
    );
  }

  if (error || vehiclesError) {
    toast.error(`Erreur lors du chargement des données : ${error?.message || vehiclesError?.message}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center text-red-500">
          <p>Une erreur est survenue : {error?.message || vehiclesError?.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-main-text"
        >
          Suivi Maintenance & Vidanges
        </motion.h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <CustomButton onClick={handleAddMaintenanceEntry} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> Ajouter Maintenance
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingMaintenanceRecord ? 'Modifier Enregistrement' : 'Ajouter Nouvel Enregistrement'}</DialogTitle>
            </DialogHeader>
            <MaintenanceRecordForm
              initialData={editingMaintenanceRecord || undefined}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              isLoading={addMaintenanceRecordIsLoading || updateMaintenanceRecordIsLoading}
              vehicles={vehicles || []}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alertes maintenance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <CustomCard className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg shadow-card-float">
          <CustomCardHeader>
            <div className="flex items-center">
              <Droplet className="text-orange-400 text-2xl mr-4" />
              <div>
                <CustomCardTitle className="text-lg font-semibold text-orange-700">Vidanges à Prévoir</CustomCardTitle>
                <CustomCardDescription className="text-orange-600" id="upcomingMaintenance">
                  {upcomingOilChanges} véhicule(s) approche(nt) des 10,000 km
                </CustomCardDescription>
              </div>
            </div>
          </CustomCardHeader>
        </CustomCard>

        <CustomCard className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg shadow-card-float maintenance-alert">
          <CustomCardHeader>
            <div className="flex items-center">
              <CircleAlert className="text-red-400 text-2xl mr-4" />
              <div>
                <CustomCardTitle className="text-lg font-semibold text-red-700">Maintenance Urgente</CustomCardTitle>
                <CustomCardDescription className="text-red-600" id="urgentMaintenance">
                  {urgentMaintenance} véhicule(s) nécessite(nt) une attention urgente
                </CustomCardDescription>
              </div>
            </div>
          </CustomCardHeader>
        </CustomCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6"
      >
        <DataTable columns={columns} data={maintenanceRecords || []} filterColumnId="type" filterPlaceholder="Filtrer par type..." />
      </motion.div>
    </div>
  );
};

export default Maintenance;