"use client";

import React, { useState, useEffect } from 'react';
import { CustomButton } from '@/components/CustomButton';
import { PlusCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import DocumentForm from '@/components/documents/DocumentForm';
import { DataTable } from '@/components/ui/data-table';
import { columns, Document } from '@/components/documents/DocumentColumns';
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

const Documents: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data: { user } } = await auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour voir les documents.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id) // Filter by user_id
      .order('issue_date', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des documents:", error.message);
      toast.error("Erreur lors du chargement des documents: " + error.message);
      setDocuments([]);
    } else {
      setDocuments(data as Document[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFormSuccess = () => {
    fetchDocuments();
    setIsAddDialogOpen(false);
    setEditingDocument(null);
  };

  const handleDeleteClick = (document: Document) => {
    setDocumentToDelete(document);
    setShowDeleteDialog(true);
  };

  const confirmDeleteDocument = async () => {
    if (documentToDelete) {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action.");
        return;
      }

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentToDelete.id)
        .eq('user_id', user.id); // Ensure user owns the record

      if (error) {
        console.error("Erreur lors de la suppression du document:", error.message);
        toast.error("Erreur lors de la suppression du document: " + error.message);
      } else {
        toast.success("Document supprimé avec succès !");
        fetchDocuments();
      }
      setDocumentToDelete(null);
      setShowDeleteDialog(false);
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
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns({ onDelete: handleDeleteClick, onEdit: handleEditClick })} data={documents} />
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