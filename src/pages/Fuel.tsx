"use client";

import React, { useState } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useFuelLogs } from '@/hooks/useFuelLogs';
import { useVehicles } from '@/hooks/useVehicles'; // Import useVehicles
import { TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import FuelLogForm from '@/components/fuel/FuelLogForm';
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
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent, CustomCardDescription } from '@/components/CustomCard';
import { Fuel as FuelIcon, Coins, LineChart } from 'lucide-react';

import type { FuelLog } from '@/hooks/useFuelLogs';
import type { FuelLogFormValues } from '@/components/fuel/FuelLogForm';

const Fuel: React.FC = () => {
  const { fuelLogs, isLoading, error, addFuelLog, updateFuelLog, deleteFuelLog, addFuelLogIsLoading, updateFuelLogIsLoading } = useFuelLogs();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFuelLog, setEditingFuelLog] = useState<FuelLog | null>(null);

  const handleAddFuelEntry = () => {
    setEditingFuelLog(null);
    setIsFormOpen(true);
  };

  const handleEditFuelEntry = (fuelLog: FuelLog) => {
    setEditingFuelLog(fuelLog);
    setIsFormOpen(true);
  };

  const handleDeleteFuelEntry = (id: string) => {
    deleteFuelLog(id);
  };

  const handleSubmitForm = (data: FuelLogFormValues & { id?: string }) => {
    if (data.id) {
      updateFuelLog(data as TablesUpdate<'fuel_logs'> & { id: string });
    } else {
      const { id, ...insertData } = data;
      addFuelLog(insertData as Omit<TablesInsert<'fuel_logs'>, 'user_id'>);
    }
    setIsFormOpen(false);
  };

  const columns: ColumnDef<FuelLog>[] = [
    {
      accessorKey: 'date',
      header: "Date",
      cell: ({ row }) => new Date(row.getValue('date') as string).toLocaleDateString(),
    },
    {
      accessorKey: 'vehicles.plate',
      header: "Véhicule",
      cell: ({ row }) => (row.original.vehicles as { plate: string })?.plate || 'N/A',
    },
    {
      accessorKey: 'liters',
      header: "Litres",
      cell: ({ row }) => `${row.getValue('liters')} L`,
    },
    {
      accessorKey: 'price_per_liter',
      header: "Prix/L",
      cell: ({ row }) => `${(row.getValue('price_per_liter') as number).toFixed(3)} TND`,
    },
    {
      accessorKey: 'cost',
      header: "Coût Total",
      cell: ({ row }) => `${(row.getValue('cost') as number).toFixed(2)} TND`,
    },
    {
      accessorKey: 'mileage',
      header: "Kilométrage",
      cell: ({ row }) => `${row.getValue('mileage')} km`,
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CustomButton variant="outline" size="sm" onClick={() => handleEditFuelEntry(row.original)}>
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le plein du{' '}
                  <span className="font-semibold">{new Date(row.original.date).toLocaleDateString()}</span> de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteFuelEntry(row.original.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  // Calculate summary data
  const totalLiters = fuelLogs?.reduce((sum, log) => sum + log.liters, 0) || 0;
  const totalFuelCost = fuelLogs?.reduce((sum, log) => sum + log.cost, 0) || 0;
  const avgFuelPrice = totalLiters > 0 ? totalFuelCost / totalLiters : 0;

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
            Chargement des Données Carburant...
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
          Gestion du Carburant
        </motion.h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <CustomButton onClick={handleAddFuelEntry} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> Ajouter Plein
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingFuelLog ? 'Modifier Plein' : 'Ajouter Nouveau Plein'}</DialogTitle>
            </DialogHeader>
            <FuelLogForm
              initialData={editingFuelLog || undefined}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              isLoading={addFuelLogIsLoading || updateFuelLogIsLoading}
              vehicles={vehicles || []}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Fuel Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <CustomCard className="bg-white rounded-xl shadow-card-float p-6">
          <CustomCardHeader>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FuelIcon className="text-blue-600 text-2xl" />
              </div>
              <div className="ml-4">
                <CustomCardDescription className="text-secondary-text text-sm font-medium">Total Litres</CustomCardDescription>
                <CustomCardTitle className="text-3xl font-bold text-main-text" id="totalLiters">{totalLiters.toFixed(2)} L</CustomCardTitle>
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent>
            {/* Additional content if needed */}
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl shadow-card-float p-6">
          <CustomCardHeader>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Coins className="text-green-600 text-2xl" />
              </div>
              <div className="ml-4">
                <CustomCardDescription className="text-secondary-text text-sm font-medium">Coût Total</CustomCardDescription>
                <CustomCardTitle className="text-3xl font-bold text-green-600" id="totalFuelCost">{totalFuelCost.toFixed(2)} TND</CustomCardTitle>
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent>
            {/* Additional content if needed */}
          </CustomCardContent>
        </CustomCard>

        <CustomCard className="bg-white rounded-xl shadow-card-float p-6">
          <CustomCardHeader>
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <LineChart className="text-orange-600 text-2xl" />
              </div>
              <div className="ml-4">
                <CustomCardDescription className="text-secondary-text text-sm font-medium">Prix Moyen/L</CustomCardDescription>
                <CustomCardTitle className="text-3xl font-bold text-orange-600" id="avgFuelPrice">{avgFuelPrice.toFixed(3)} TND</CustomCardTitle>
              </div>
            </div>
          </CustomCardHeader>
          <CustomCardContent>
            {/* Additional content if needed */}
          </CustomCardContent>
        </CustomCard>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6"
      >
        <DataTable columns={columns} data={fuelLogs || []} filterColumnId="date" filterPlaceholder="Filtrer par date..." />
      </motion.div>
    </div>
  );
};

export default Fuel;