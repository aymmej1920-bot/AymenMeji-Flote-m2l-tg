"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { CustomCard, CustomCardContent } from '@/components/CustomCard';
import { CustomButton } from '@/components/CustomButton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'unread' | 'read' | 'archived';
  related_entity_id?: string;
  related_entity_type?: string;
  created_at: string;
};

interface NotificationListProps {
  notifications: Notification[];
  onNotificationUpdate: () => void; // Callback to refetch notifications
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, onNotificationUpdate }) => {

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de la mise à jour du statut de la notification:", error.message);
      toast.error("Erreur: " + error.message);
    } else {
      toast.success("Notification marquée comme lue.");
      onNotificationUpdate();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ status: 'archived' })
      .eq('id', id);

    if (error) {
      console.error("Erreur lors de l'archivage de la notification:", error.message);
      toast.error("Erreur: " + error.message);
    } else {
      toast.success("Notification archivée.");
      onNotificationUpdate();
    }
  };

  if (notifications.length === 0) {
    return (
      <CustomCard className="p-6 text-center">
        <CustomCardContent>
          <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Aucune nouvelle notification pour le moment.
          </p>
        </CustomCardContent>
      </CustomCard>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <CustomCard className={cn(
            "p-4 flex items-start space-x-4",
            notification.status === 'unread' ? "bg-card border-l-4 border-primary" : "bg-muted/50"
          )}>
            <div className="flex-shrink-0 mt-1">
              {getIcon(notification.type)}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-foreground">{notification.title}</h3>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true, locale: fr })}
              </p>
              {notification.related_entity_type && notification.related_entity_id && (
                <p className="text-xs text-gray-500 mt-1">
                  Lié à: {notification.related_entity_type} (ID: {notification.related_entity_id.substring(0, 8)}...)
                </p>
              )}
            </div>
            <div className="flex-shrink-0 flex space-x-2">
              {notification.status === 'unread' && (
                <CustomButton variant="secondary" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                  Marquer comme lu
                </CustomButton>
              )}
              {notification.status !== 'archived' && (
                <CustomButton variant="ghost" size="sm" onClick={() => handleArchive(notification.id)}>
                  Archiver
                </CustomButton>
              )}
            </div>
          </CustomCard>
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationList;