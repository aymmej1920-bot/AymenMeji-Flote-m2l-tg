"use client";

import React, { useState } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { Plus, Edit, Trash2, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { useDocuments } from '@/hooks/useDocuments';
import { useVehicles } from '@/hooks/useVehicles'; // Import useVehicles
import { TablesInsert, TablesUpdate } from '@/types/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DocumentForm from '@/components/documents/DocumentForm';
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
import { CustomCard } from '@/components/CustomCard';

import type { Document } from '@/hooks/useDocuments';
import type { DocumentFormValues } from '@/components/documents/DocumentForm';

const Documents: React.FC = () => {
  const { documents, isLoading, error, addDocument, updateDocument, deleteDocument, addDocumentIsLoading, updateDocumentIsLoading } = useDocuments();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  const handleAddDocument = () => {
    setEditingDocument(null);
    setIsFormOpen(true);
  };

  const handleEditDocument = (document: Document) => {
    setEditingDocument(document);
    setIsFormOpen(true);
  };

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
  };

  const handleSubmitForm = (data: DocumentFormValues & { id?: string }) => {
    if (data.id) {
      updateDocument(data as TablesUpdate<'documents'> & { id: string });
    } else {
      const { id, ...insertData } = data;
      addDocument(insertData as Omit<TablesInsert<'documents'>, 'user_id'>);
    }
    setIsFormOpen(false);
  };

  const columns: ColumnDef<Document>[] = [
    {
      accessorKey: 'type',
      header: "Type de document",
    },
    {
      accessorKey: 'number',
      header: "Numéro",
    },
    {
      accessorKey: 'vehicles', // Changed accessorKey to the object itself
      header: "Véhicule",
      cell: ({ row }) => (row.original.vehicles ? row.original.vehicles.plate : 'N/A'), // Access plate from the nested object
    },
    {
      accessorKey: 'expiration',
      header: "Date d'expiration",
      cell: ({ row }) => {
        const expirationDate = new Date(row.getValue('expiration') as string);
        const today = new Date();
        const diffTime = expirationDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let textColorClass = 'text-main-text';
        if (diffDays <= 30 && diffDays >= 0) {
          textColorClass = 'text-orange-600 font-semibold';
        } else if (diffDays < 0) {
          textColorClass = 'text-red-600 font-semibold';
        }

        return (
          <span className={textColorClass}>
            {expirationDate.toLocaleDateString()}
            {diffDays < 0 && ' (Expiré)'}
            {diffDays >= 0 && diffDays <= 30 && ` (Expire dans ${diffDays} jours)`}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <CustomButton variant="outline" size="sm" onClick={() => handleEditDocument(row.original)}>
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
                  Cette action ne peut pas être annulée. Cela supprimera définitivement le document{' '}
                  <span className="font-semibold">{row.original.type} - {row.original.number}</span> de nos serveurs.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteDocument(row.original.id)}>
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const expiringDocuments = documents?.filter(doc => {
    const expirationDate = new Date(doc.expiration);
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }).length || 0;

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
            Chargement des Documents...
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
          Suivi des Documents
        </motion.h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <CustomButton onClick={handleAddDocument} className="primary-button-gradient text-white px-6 py-3 rounded-lg shadow-card-float transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" /> Ajouter Document
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingDocument ? 'Modifier Document' : 'Ajouter Nouveau Document'}</DialogTitle>
            </DialogHeader>
            <DocumentForm
              initialData={editingDocument || undefined}
              onSubmit={handleSubmitForm}
              onCancel={() => setIsFormOpen(false)}
              isLoading={addDocumentIsLoading || updateDocumentIsLoading}
              vehicles={vehicles || []}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Alerts */}
      {expiringDocuments > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <CustomCard className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg shadow-card-float alert-expire">
            <div className="flex items-center">
              <TriangleAlert className="text-red-400 mr-3 h-5 w-5" />
              <span className="text-red-700"><strong>Attention!</strong> {expiringDocuments} document(s) expire(nt) dans moins de 30 jours.</span>
            </div>
          </CustomCard>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-card-float overflow-hidden p-6"
      >
        <DataTable columns={columns} data={documents || []} filterColumnId="type" filterPlaceholder="Filtrer par type..." />
      </motion.div>
    </div>
  );
};

export default Documents;