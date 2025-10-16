"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

type Vehicle = TablesInsert<'vehicles'> & { id: string }; // Extend with id for existing vehicles

// Fetch all vehicles for the current user
const fetchVehicles = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new vehicle
const addVehicle = async (newVehicle: TablesInsert<'vehicles'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('vehicles')
    .insert({ ...newVehicle, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing vehicle
const updateVehicle = async (updatedVehicle: TablesUpdate<'vehicles'> & { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('vehicles')
    .update(updatedVehicle)
    .eq('id', updatedVehicle.id)
    .eq('user_id', user.id) // Ensure user can only update their own vehicles
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a vehicle
const deleteVehicle = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own vehicles

  if (error) throw error;
  return null;
};

export const useVehicles = () => {
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading, error } = useQuery<Vehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
  });

  const addVehicleMutation = useMutation<Vehicle, Error, TablesInsert<'vehicles'>>({
    mutationFn: addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Véhicule ajouté avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout du véhicule : ${err.message}`);
    },
  });

  const updateVehicleMutation = useMutation<Vehicle, Error, TablesUpdate<'vehicles'> & { id: string }>({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Véhicule mis à jour avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la mise à jour du véhicule : ${err.message}`);
    },
  });

  const deleteVehicleMutation = useMutation<null, Error, string>({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast.success('Véhicule supprimé avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la suppression du véhicule : ${err.message}`);
    },
  });

  return {
    vehicles,
    isLoading,
    error,
    addVehicle: addVehicleMutation.mutate,
    updateVehicle: updateVehicleMutation.mutate,
    deleteVehicle: deleteVehicleMutation.mutate,
    addVehicleIsLoading: addVehicleMutation.isPending, // Expose isPending state
    updateVehicleIsLoading: updateVehicleMutation.isPending, // Expose isPending state
  };
};