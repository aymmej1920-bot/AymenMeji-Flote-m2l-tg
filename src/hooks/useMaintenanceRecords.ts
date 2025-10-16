"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

export type MaintenanceRecord = TablesInsert<'maintenance_records'> & { 
  id: string;
  vehicles: { plate: string } | null; // Ajout de la propriété vehicles
};

// Fetch all maintenance records for the current user
const fetchMaintenanceRecords = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('maintenance_records')
    .select('*, vehicles(plate)') // Select related vehicle plate
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new maintenance record
const addMaintenanceRecord = async (newMaintenanceRecordData: Omit<TablesInsert<'maintenance_records'>, 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('maintenance_records')
    .insert({ ...newMaintenanceRecordData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing maintenance record
const updateMaintenanceRecord = async (updatedMaintenanceRecord: TablesUpdate<'maintenance_records'> & { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('maintenance_records')
    .update(updatedMaintenanceRecord)
    .eq('id', updatedMaintenanceRecord.id)
    .eq('user_id', user.id) // Ensure user can only update their own records
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a maintenance record
const deleteMaintenanceRecord = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('maintenance_records')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own records

  if (error) throw error;
  return null;
};

export const useMaintenanceRecords = () => {
  const queryClient = useQueryClient();

  const { data: maintenanceRecords, isLoading, error } = useQuery<MaintenanceRecord[], Error>({
    queryKey: ['maintenanceRecords'],
    queryFn: fetchMaintenanceRecords,
  });

  const addMaintenanceRecordMutation = useMutation<MaintenanceRecord, Error, Omit<TablesInsert<'maintenance_records'>, 'user_id'>>({
    mutationFn: addMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      toast.success('Enregistrement de maintenance ajouté avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout de l'enregistrement : ${err.message}`);
    },
  });

  const updateMaintenanceRecordMutation = useMutation<MaintenanceRecord, Error, TablesUpdate<'maintenance_records'> & { id: string }>({
    mutationFn: updateMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      toast.success('Enregistrement de maintenance mis à jour avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la mise à jour de l'enregistrement : ${err.message}`);
    },
  });

  const deleteMaintenanceRecordMutation = useMutation<null, Error, string>({
    mutationFn: deleteMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      toast.success('Enregistrement de maintenance supprimé avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la suppression de l'enregistrement : ${err.message}`);
    },
  });

  return {
    maintenanceRecords,
    isLoading,
    error,
    addMaintenanceRecord: addMaintenanceRecordMutation.mutate,
    updateMaintenanceRecord: updateMaintenanceRecordMutation.mutate,
    deleteMaintenanceRecord: deleteMaintenanceRecordMutation.mutate,
    addMaintenanceRecordIsLoading: addMaintenanceRecordMutation.isPending,
    updateMaintenanceRecordIsLoading: updateMaintenanceRecordMutation.isPending,
  };
};