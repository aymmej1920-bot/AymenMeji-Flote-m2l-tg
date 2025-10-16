"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DocumentForm from '@/components/documents/DocumentForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Document } from '@/components/documents/DocumentColumns';
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

const Documents: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les documents.");
    }
    return user.id;
  };

  // Fetch documents using React Query
  const { data: documents, isLoading, error } = useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      return data as Document[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des documents: " + error.message);
    }
  }, [error]);

  // Mutation for deleting a document
  const deleteDocumentMutation = useMutation<void, Error, string>({
    mutationFn: async (documentId: string) => {
      const userId = await getUserId();
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Document supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setDocumentToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      console.error("Erreur lors de la suppression du document:", err.message);
      toast.error("Erreur lors de la suppression du document: " + err.message);
    },
  });

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    setIsAddDialogOpen(false);
    setEditingDocument(null);
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      deleteDocumentMutation.mutate(documentToDelete.id);
    }
  };

  const handleEditClick = (document: Document) => {
    setEditingDocument(document);
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
        <h1 className="text-3xl font-heading font-bold text-foreground">Gestion des Documents</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingDocument(null);
        }}>
          <DialogTrigger asChild>
            <CustomButton onClick={() => setEditingDocument(null)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Document
            </CustomButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-heading text-foreground">
                {editingDocument ? "Modifier le document" : "Ajouter un nouveau document"}
              </DialogTitle>
            </DialogHeader>
            <DocumentForm onSuccess={handleFormSuccess} initialData={editingDocument || undefined} />
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
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={documents || []} />
          )}
        </CustomCard>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le document "{documentToDelete?.title}" de nos serveurs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documents;