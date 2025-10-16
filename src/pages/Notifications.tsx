"use client";

import React, { useState, useEffect } from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { Bell, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import NotificationList, { Notification } from '@/components/notifications/NotificationList'; // Import NotificationList and Notification type
import { CustomButton } from '@/components/CustomButton';
import { supabase, auth } from '@/lib/supabase'; // Import auth
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: { user } } = await auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour voir les notifications.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id) // Filter by user_id
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur lors du chargement des notifications:", error.message);
      toast.error("Erreur lors du chargement des notifications: " + error.message);
      setNotifications([]);
    } else {
      setNotifications(data as Notification[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleCreateTestNotification = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      toast.error("Vous devez être connecté pour créer une notification de test.");
      return;
    }

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
          user_id: user.id, // Assign to current user
        }
      ]);

    if (error) {
      console.error("Erreur lors de la création de la notification de test:", error.message);
      toast.error("Erreur lors de la création de la notification de test: " + error.message);
    } else {
      toast.success("Notification de test créée avec succès !");
      fetchNotifications(); // Refresh the list
    }
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
        <CustomButton onClick={handleCreateTestNotification}>
          <PlusCircle className="mr-2 h-4 w-4" /> Créer une Notification de Test
        </CustomButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <NotificationList notifications={notifications} onNotificationUpdate={fetchNotifications} />
        )}
      </motion.div>
    </div>
  );
};

export default Notifications;