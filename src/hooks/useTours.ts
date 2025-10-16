"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { TablesInsert, TablesUpdate } from '@/types/supabase';

export type Tour = TablesInsert<'tours'> & { 
  id: string;
  vehicles: { plate: string } | null; // Ajout de la propriété vehicles
  drivers: { name: string } | null;   // Ajout de la propriété drivers
};

// Fetch all tours for the current user
const fetchTours = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tours')
    .select('*, vehicles(plate), drivers(name)') // Select related vehicle plate and driver name
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
};

// Add a new tour
const addTour = async (newTourData: Omit<TablesInsert<'tours'>, 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tours')
    .insert({ ...newTourData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Update an existing tour
const updateTour = async (updatedTour: TablesUpdate<'tours'> & { id: string }) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('tours')
    .update(updatedTour)
    .eq('id', updatedTour.id)
    .eq('user_id', user.id) // Ensure user can only update their own tours
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a tour
const deleteTour = async (id: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('tours')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id); // Ensure user can only delete their own tours

  if (error) throw error;
  return null;
};

export const useTours = () => {
  const queryClient = useQueryClient();

  const { data: tours, isLoading, error } = useQuery<Tour[], Error>({
    queryKey: ['tours'],
    queryFn: fetchTours,
  });

  const addTourMutation = useMutation<Tour, Error, Omit<TablesInsert<'tours'>, 'user_id'>>({
    mutationFn: addTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tournée ajoutée avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de l'ajout de la tournée : ${err.message}`);
    },
  });

  const updateTourMutation = useMutation<Tour, Error, TablesUpdate<'tours'> & { id: string }>({
    mutationFn: updateTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tournée mise à jour avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la mise à jour de la tournée : ${err.message}`);
    },
  });

  const deleteTourMutation = useMutation<null, Error, string>({
    mutationFn: deleteTour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tournée supprimée avec succès !');
    },
    onError: (err) => {
      toast.error(`Erreur lors de la suppression de la tournée : ${err.message}`);
    },
  });

  return {
    tours,
    isLoading,
    error,
    addTour: addTourMutation.mutate,
    updateTour: updateTourMutation.mutate,
    deleteTour: deleteTourMutation.mutate,
    addTourIsLoading: addTourMutation.isPending,
    updateTourIsLoading: updateTourMutation.isPending,
  };
};