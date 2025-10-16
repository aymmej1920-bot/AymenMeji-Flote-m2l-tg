"use client";

import React, { useState } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useDrivers } from '@/hooks/useDrivers';
import { TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DriverForm from '@/components/drivers/DriverForm';
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

import type { Driver } from '@/hooks/useDrivers';
import type { DriverFormValues } from '@/components/drivers/DriverForm';

const Drivers: React.FC = () => {
  const { drivers, isLoading, error, addDriver, updateDriver, deleteDriver, addDriverIsLoading, updateDriverIsLoading } = useDrivers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const handleAddDriver = () => {
    setEditingDriver(null);
    setIsFormOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsFormOpen(true);
  };

  const handleDeleteDriver = (id: string) => {
    deleteDriver(id);
  };

  const handleSubmitForm = (data: DriverFormValues & { id?: string }) => {
    if (data.id) {
      updateDriver(data as TablesUpdate<'drivers'> & { id: string });
    } else {
      const { id, ...insertData } = data;
      addDriver(insertData as Omit<TablesInsert<'drivers'>, 'user_id'>);
    }
    setIsFormOpen(false);
  };

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: 'name',
      header: "Nom du conducteur",
    },
    {
      accessorKey: 'license',
      header: "Numéro de permis",
    },
    {
      accessorKey: 'expiration',
      header: "Expiration du permis",
      cell: ({ row }) => (row.getValue('expiration') ? new Date(row.getValue('expiration') as string).toLocaleDateString() : 'N/A'),
    },
    {
      accessorKey: 'status',
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue('status') as Driver['status'];
        let badgeClass = '';
        switch (status) {
          case 'Disponible':
            badgeClass = 'bg-green-100 text-green-800';
            break;
          case 'En Mission':
            badgeClass = 'bg-orange-100 text-orange-800';
            break;
          case 'En Congé':
            badgeClass = 'bg-blue-100 text-blue-800';
            break;
          default:
            badgeClass = 'bg-gray-100 text-gray-800';
        }
        return <span className={`status-badge ${badgeClass}`}>{status}</span>;
      },
    },
    {
      accessorKey: 'phone',
      header: "Téléphone",
      cell: ({ row }) => row.getValue('phone') || 'N/A',
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CustomButton variant="outline" size="sm" onClick={() => handleEditDriver(row.original)}>
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le conducteur{' '}
                  <span className="font-semibold">{row.original.name}</span> de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteDriver(row.original.id)}>
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
            className="text-4xl font-bold text-main-text"
          >
            Chargement des Conducteurs...
          </motion.h1>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error(`Erreur lors du chargement des conducteurs : ${error.message}`);
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
          className="text-4xl font-bold text-main-text"
        >
          Gestion des Conducteurs
        </motion.h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <CustomButton onClick={handleAddDriver} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> Ajouter Conducteur
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingDriver ? 'Modifier Conducteur' : 'Ajouter Nouveau Conducteur'}</DialogTitle>
            </DialogHeader>
            <DriverForm
              initialData={editingDriver || undefined}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              isLoading={addDriverIsLoading || updateDriverIsLoading}
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
        <DataTable columns={columns} data={drivers || []} filterColumnId="name" filterPlaceholder="Filtrer par nom..." />
      </motion.div>
    </div>
  );
};

export default Drivers;