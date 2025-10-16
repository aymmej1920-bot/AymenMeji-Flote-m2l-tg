"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

export type Driver = TablesInsert<'drivers'> & { id: string };

// Fetch all drivers for the current user
const fetchDrivers = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new driver
const addDriver = async (newDriverData: Omit<TablesInsert<'drivers'>, 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('drivers')
    .insert({ ...newDriverData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing driver
const updateDriver = async (updatedDriver: TablesUpdate<'drivers'> & { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('drivers')
    .update(updatedDriver)
    .eq('id', updatedDriver.id)
    .eq('user_id', user.id) // Ensure user can only update their own drivers
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a driver
const deleteDriver = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('drivers')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own drivers

  if (error) throw error;
  return null;
};

export const useDrivers = () => {
  const queryClient = useQueryClient();

  const { data: drivers, isLoading, error } = useQuery<Driver[], Error>({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
  });

  const addDriverMutation = useMutation<Driver, Error, Omit<TablesInsert<'drivers'>, 'user_id'>>({
    mutationFn: addDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Conducteur ajouté avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout du conducteur : ${err.message}`);
    },
  });

  const updateDriverMutation = useMutation<Driver, Error, TablesUpdate<'drivers'> & { id: string }>({
    mutationFn: updateDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Conducteur mis à jour avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la mise à jour du conducteur : ${err.message}`);
    },
  });

  const deleteDriverMutation = useMutation<null, Error, string>({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Conducteur supprimé avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la suppression du conducteur : ${err.message}`);
    },
  });

  return {
    drivers,
    isLoading,
    error,
    addDriver: addDriverMutation.mutate,
    updateDriver: updateDriverMutation.mutate,
    deleteDriver: deleteDriverMutation.mutate,
    addDriverIsLoading: addDriverMutation.isPending,
    updateDriverIsLoading: updateDriverMutation.isPending,
  };
};