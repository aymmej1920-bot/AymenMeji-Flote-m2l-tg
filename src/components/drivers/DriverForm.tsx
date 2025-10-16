"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CustomButton } from '@/components/CustomButton';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import type { Driver } from '@/hooks/useDrivers';

const driverFormSchema = z.object({
  name: z.string().min(1, "Le nom du conducteur est requis."),
  license: z.string().min(1, "Le numéro de permis est requis."),
  expiration: z.string().min(1, "La date d'expiration est requise."),
  status: z.enum(['Disponible', 'En Mission', 'En Congé'], {
    required_error: "Le statut est requis.",
  }),
  phone: z.string().optional().nullable(),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;

interface DriverFormProps {
  initialData?: Driver;
  onSubmit: (data: DriverFormValues & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DriverForm: React.FC<DriverFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      license: initialData?.license || '',
      expiration: initialData?.expiration || '',
      status: (initialData?.status || 'Disponible') as DriverFormValues['status'],
      phone: initialData?.phone || '',
    },
  });

  const handleSubmit = (values: DriverFormValues) => {
    const dataToPass = {
      ...values,
      phone: values.phone || null, // Ensure empty string becomes null for Supabase
    };

    if (initialData) {
      onSubmit({ ...dataToPass, id: initialData.id });
    } else {
      onSubmit(dataToPass);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du conducteur</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Jean Dupont" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="license"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de permis</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'expiration du permis</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Disponible">Disponible</SelectItem>
                  <SelectItem value="En Mission">En Mission</SelectItem>
                  <SelectItem value="En Congé">En Congé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone (optionnel)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: +216 12 345 678" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mt-6">
          <CustomButton variant="outline" onClick={onCancel} type="button" disabled={isLoading}>
            Annuler
          </CustomButton>
          <CustomButton type="submit" disabled={isLoading}>
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier Conducteur' : 'Ajouter Conducteur')}
          </CustomButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DriverForm;