"use client";

import React, { useState } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useVehicles } from '@/hooks/useVehicles';
import { TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import VehicleForm from '@/components/vehicles/VehicleForm';
import { toast } from 'sonner';
// import { CustomCard } from '@/components/CustomCard'; // Removed: CustomCard is not used here
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

// Import the Vehicle type from useVehicles hook
import type { Vehicle } from '@/hooks/useVehicles';
import type { VehicleFormValues } from '@/components/vehicles/VehicleForm'; // Import VehicleFormValues

const Vehicles: React.FC = () => {
  const { vehicles, isLoading, error, addVehicle, updateVehicle, deleteVehicle, addVehicleIsLoading, updateVehicleIsLoading } = useVehicles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicle(id);
  };

  const handleSubmitForm = (data: VehicleFormValues & { id?: string }) => {
    if (data.id) {
      // This is an update operation
      updateVehicle(data as TablesUpdate<'vehicles'> & { id: string });
    } else {
      // This is an add operation
      const { id, ...insertData } = data; // Destructure id, it's not part of insert
      addVehicle(insertData as Omit<TablesInsert<'vehicles'>, 'user_id'>);
    }
    setIsFormOpen(false);
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: 'plate',
      header: "Plaque d'immatriculation",
    },
    {
      accessorKey: 'type',
      header: "Type de véhicule",
    },
    {
      accessorKey: 'status',
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue('status') as Vehicle['status']; // Explicitly cast to Vehicle['status']
        let badgeClass = '';
        switch (status) {
          case 'Disponible':
            badgeClass = 'bg-green-100 text-green-800';
            break;
          case 'En Mission':
            badgeClass = 'bg-orange-100 text-orange-800';
            break;
          case 'Maintenance':
            badgeClass = 'bg-red-100 text-red-800';
            break;
          default:
            badgeClass = 'bg-gray-100 text-gray-800';
        }
        return <span className={`status-badge ${badgeClass}`}>{status}</span>;
      },
    },
    {
      accessorKey: 'mileage',
      header: "Kilométrage",
      cell: ({ row }) => `${row.getValue('mileage')} km`,
    },
    {
      accessorKey: 'last_service_date',
      header: "Dernier service",
      cell: ({ row }) => (row.getValue('last_service_date') ? new Date(row.getValue('last_service_date') as string).toLocaleDateString() : 'N/A'),
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CustomButton variant="outline" size="sm" onClick={() => handleEditVehicle(row.original)}>
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le véhicule{' '}
                  <span className="font-semibold">{row.original.plate}</span> de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteVehicle(row.original.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="space-y-4 w-full max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-main-text" // Use main-text color
          >
            Chargement des Véhicules...
          </motion.h1>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(`Erreur lors du chargement des véhicules : ${error.message}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center text-red-500">
          <p>Une erreur est survenue : {error.message}</p>
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
          className="text-4xl font-bold text-main-text" // Use main-text color
        >
          Gestion des Véhicules
        </motion.h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <CustomButton onClick={handleAddVehicle} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300"> {/* Use gradient and new shadow */}
              <Plus className="mr-2 h-4 w-4" /> Ajouter Véhicule
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? 'Modifier Véhicule' : 'Ajouter Nouveau Véhicule'}</DialogTitle>
            </DialogHeader>
            <VehicleForm
              initialData={editingVehicle || undefined}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              isLoading={addVehicleIsLoading || updateVehicleIsLoading} // Corrected: use isPending states
            />
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6" // Use new card shadow
      >
        <DataTable columns={columns} data={vehicles || []} filterColumnId="plate" filterPlaceholder="Filtrer par plaque..." />
      </motion.div>
    </div>
  );
};

export default Vehicles;