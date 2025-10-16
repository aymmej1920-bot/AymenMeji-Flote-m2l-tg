"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

export type FuelLog = TablesInsert<'fuel_logs'> & { 
  id: string;
  vehicles: { plate: string } | null; // Ajout de la propriété vehicles
};

// Fetch all fuel logs for the current user
const fetchFuelLogs = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('fuel_logs')
    .select('*, vehicles(plate)') // Select related vehicle plate
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new fuel log
const addFuelLog = async (newFuelLogData: Omit<TablesInsert<'fuel_logs'>, 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('fuel_logs')
    .insert({ ...newFuelLogData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing fuel log
const updateFuelLog = async (updatedFuelLog: TablesUpdate<'fuel_logs'> & { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('fuel_logs')
    .update(updatedFuelLog)
    .eq('id', updatedFuelLog.id)
    .eq('user_id', user.id) // Ensure user can only update their own fuel logs
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a fuel log
const deleteFuelLog = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('fuel_logs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own fuel logs

  if (error) throw error;
  return null;
};

export const useFuelLogs = () => {
  const queryClient = useQueryClient();

  const { data: fuelLogs, isLoading, error } = useQuery<FuelLog[], Error>({
    queryKey: ['fuelLogs'],
    queryFn: fetchFuelLogs,
  });

  const addFuelLogMutation = useMutation<FuelLog, Error, Omit<TablesInsert<'fuel_logs'>, 'user_id'>>({
    mutationFn: addFuelLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
      toast.success('Plein de carburant ajouté avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout du plein : ${err.message}`);
    },
  });

  const updateFuelLogMutation = useMutation<FuelLog, Error, TablesUpdate<'fuel_logs'> & { id: string }>({
    mutationFn: updateFuelLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
      toast.success('Plein de carburant mis à jour avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la mise à jour du plein : ${err.message}`);
    },
  });

  const deleteFuelLogMutation = useMutation<null, Error, string>({
    mutationFn: deleteFuelLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
      toast.success('Plein de carburant supprimé avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la suppression du plein : ${err.message}`);
    },
  });

  return {
    fuelLogs,
    isLoading,
    error,
    addFuelLog: addFuelLogMutation.mutate,
    updateFuelLog: updateFuelLogMutation.mutate,
    deleteFuelLog: deleteFuelLogMutation.mutate,
    addFuelLogIsLoading: addFuelLogMutation.isPending,
    updateFuelLogIsLoading: updateFuelLogMutation.isPending,
  };
};