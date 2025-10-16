"use client";

import React, { useState, useEffect } from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { Bell, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationList, { Notification } from '@/components/notifications/NotificationList';
import { CustomButton } from '@/components/CustomButton';
import { supabase, auth } from '@/lib/supabase';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks

const Notifications: React.FC = () => {
  const queryClient = useQueryClient();

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les notifications.");
    }
    return user.id;
  };

  // Fetch notifications using React Query
  const { data: notifications, isLoading, error } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    },
  });

  useEffect(() => {
    if (error) {
      toast.error("Erreur lors du chargement des notifications: " + error.message);
    }
  }, [error]);

  // Mutation for creating a test notification
  const createTestNotificationMutation = useMutation<void, Error, void>({
    mutationFn: async () => {
      const userId = await getUserId();
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            title: "Nouvelle Alerte de Test",
            message: "Ceci est une notification de test pour la maintenance d'un véhicule.",
            type: "warning",
            status: "unread",
            related_entity_type: "maintenance",
            related_entity_id: "a1b2c3d4-e5f6-7890-1234-567890abcdef", // Example ID
            user_id: userId,
          }
        ]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Notification de test créée avec succès !");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (err) => {
      console.error("Erreur lors de la création de la notification de test:", err.message);
      toast.error("Erreur lors de la création de la notification de test: " + err.message);
    },
  });

  const handleCreateTestNotification = () => {
    createTestNotificationMutation.mutate();
  };

  const handleNotificationUpdate = () => {
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-heading font-bold text-foreground">Alertes et Notifications</h1>
        <CustomButton onClick={handleCreateTestNotification} disabled={createTestNotificationMutation.isPending}>
          {createTestNotificationMutation.isPending ? "Création..." : (<><PlusCircle className="mr-2 h-4 w-4" /> Créer une Notification de Test</>)}
        </CustomButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <NotificationList notifications={notifications || []} onNotificationUpdate={handleNotificationUpdate} />
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;