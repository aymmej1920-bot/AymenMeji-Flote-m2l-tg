"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

export type Document = TablesInsert<'documents'> & { 
  id: string;
  vehicles: { plate: string } | null; // Ajout de la propriété vehicles
};

// Fetch all documents for the current user
const fetchDocuments = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .select('*, vehicles(plate)') // Select related vehicle plate
    .eq('user_id', user.id)
    .order('expiration', { ascending: true });

  if (error) throw error;
  return data;
};

// Add a new document
const addDocument = async (newDocumentData: Omit<TablesInsert<'documents'>, 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .insert({ ...newDocumentData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing document
const updateDocument = async (updatedDocument: TablesUpdate<'documents'> & { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('documents')
    .update(updatedDocument)
    .eq('id', updatedDocument.id)
    .eq('user_id', user.id) // Ensure user can only update their own documents
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a document
const deleteDocument = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own documents

  if (error) throw error;
  return null;
};

export const useDocuments = () => {
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery<Document[], Error>({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  const addDocumentMutation = useMutation<Document, Error, Omit<TablesInsert<'documents'>, 'user_id'>>({
    mutationFn: addDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document ajouté avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout du document : ${err.message}`);
    },
  });

  const updateDocumentMutation = useMutation<Document, Error, TablesUpdate<'documents'> & { id: string }>({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document mis à jour avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la mise à jour du document : ${err.message}`);
    },
  });

  const deleteDocumentMutation = useMutation<null, Error, string>({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document supprimé avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la suppression du document : ${err.message}`);
    },
  });

  return {
    documents,
    isLoading,
    error,
    addDocument: addDocumentMutation.mutate,
    updateDocument: updateDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    addDocumentIsLoading: addDocumentMutation.isPending,
    updateDocumentIsLoading: updateDocumentMutation.isPending,
  };
};