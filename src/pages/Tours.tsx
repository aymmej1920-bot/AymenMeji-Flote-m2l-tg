"use client";

import React, { useState } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useTours } from '@/hooks/useTours';
import { useVehicles } from '@/hooks/useVehicles'; // Import useVehicles
import { useDrivers } from '@/hooks/useDrivers'; // Import useDrivers
import { TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TourForm from '@/components/tours/TourForm';
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

import type { Tour } from '@/hooks/useTours';
import type { TourFormValues } from '@/components/tours/TourForm';

const Tours: React.FC = () => {
  const { tours, isLoading, error, addTour, updateTour, deleteTour, addTourIsLoading, updateTourIsLoading } = useTours();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();
  const { drivers, isLoading: driversLoading, error: driversError } = useDrivers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);

  const handleAddTour = () => {
    setEditingTour(null);
    setIsFormOpen(true);
  };

  const handleEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setIsFormOpen(true);
  };

  const handleDeleteTour = (id: string) => {
    deleteTour(id);
  };

  const handleSubmitForm = (data: TourFormValues & { id?: string }) => {
    if (data.id) {
      updateTour(data as TablesUpdate<'tours'> & { id: string });
    } else {
      const { id, ...insertData } = data;
      addTour(insertData as Omit<TablesInsert<'tours'>, 'user_id'>);
    }
    setIsFormOpen(false);
  };

  const columns: ColumnDef<Tour>[] = [
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
      accessorKey: 'drivers', // Changed accessorKey to the object itself
      header: "Conducteur",
      cell: ({ row }) => (row.original.drivers ? row.original.drivers.name : 'N/A'), // Access name from the nested object
    },
    {
      accessorKey: 'status',
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue('status') as Tour['status'];
        let badgeClass = '';
        switch (status) {
          case 'Planifié':
            badgeClass = 'bg-blue-100 text-blue-800';
            break;
          case 'En Cours':
            badgeClass = 'bg-orange-100 text-orange-800';
            break;
          case 'Terminé':
            badgeClass = 'bg-green-100 text-green-800';
            break;
          case 'Annulé':
            badgeClass = 'bg-red-100 text-red-800';
            break;
          default:
            badgeClass = 'bg-gray-100 text-gray-800';
        }
        return <span className={`status-badge ${badgeClass}`}>{status}</span>;
      },
    },
    {
      accessorKey: 'km_start',
      header: "KM Départ",
      cell: ({ row }) => (row.getValue('km_start') ? `${row.getValue('km_start')} km` : 'N/A'),
    },
    {
      accessorKey: 'km_end',
      header: "KM Arrivée",
      cell: ({ row }) => (row.getValue('km_end') ? `${row.getValue('km_end')} km` : 'N/A'),
    },
    {
      accessorKey: 'distance',
      header: "Distance",
      cell: ({ row }) => (row.getValue('distance') ? `${row.getValue('distance')} km` : 'N/A'),
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CustomButton variant="outline" size="sm" onClick={() => handleEditTour(row.original)}>
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement la tournée du{' '}
                  <span className="font-semibold">{new Date(row.original.date).toLocaleDateString()}</span> de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteTour(row.original.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  if (isLoading || vehiclesLoading || driversLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="space-y-4 w-full max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-main-text"
          >
            Chargement des Tournées...
          </motion.h1>
        </div>
      </div>
    );
  }

  if (error || vehiclesError || driversError) {
    toast.error(`Erreur lors du chargement des données : ${error?.message || vehiclesError?.message || driversError?.message}`);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center text-red-500">
          <p>Une erreur est survenue : {error?.message || vehiclesError?.message || driversError?.message}</p>
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
          Suivi des Tournées Avancé
        </motion.h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <CustomButton onClick={handleAddTour} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> Nouvelle Tournée
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingTour ? 'Modifier Tournée' : 'Ajouter Nouvelle Tournée'}</DialogTitle>
            </DialogHeader>
            <TourForm
              initialData={editingTour || undefined}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              isLoading={addTourIsLoading || updateTourIsLoading}
              vehicles={vehicles || []}
              drivers={drivers || []}
            />
          </DialogContent>
        </Dialog>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6"
      >
        <DataTable columns={columns} data={tours || []} filterColumnId="date" filterPlaceholder="Filtrer par date..." />
      </motion.div>
    </div>
  );
};

export default Tours;