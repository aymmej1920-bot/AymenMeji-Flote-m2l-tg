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
// Removed: import { TablesInsert, TablesUpdate } from '@/types/supabase'; // Not directly used here
import type { Vehicle } from '@/hooks/useVehicles'; // Import Vehicle type for initialData

const vehicleFormSchema = z.object({
  plate: z.string().min(1, "La plaque d'immatriculation est requise."),
  type: z.string().min(1, "Le type de véhicule est requis."),
  status: z.enum(['Disponible', 'En Mission', 'Maintenance'], {
    required_error: "Le statut est requis.",
  }),
  mileage: z.coerce.number().min(0, "Le kilométrage doit être positif."),
  last_service_date: z.string().optional().nullable(),
  last_service_mileage: z.coerce.number().optional().nullable(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>; // Exported type

interface VehicleFormProps {
  initialData?: Vehicle; // Use the exported Vehicle type
  onSubmit: (data: VehicleFormValues & { id?: string }) => void; // Simplified type for what the form actually produces
  onCancel: () => void;
  isLoading?: boolean;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const form = useForm<VehicleFormValues>({ // Explicitly define generic type
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plate: initialData?.plate || '',
      type: initialData?.type || '',
      status: (initialData?.status || 'Disponible') as VehicleFormValues['status'], // Cast to specific enum type
      mileage: initialData?.mileage || 0,
      last_service_date: initialData?.last_service_date || '',
      last_service_mileage: initialData?.last_service_mileage || 0,
    },
  });

  const handleSubmit = (values: VehicleFormValues) => {
    const dataToPass = {
      ...values,
      mileage: Number(values.mileage),
      // Simplified: values.last_service_mileage is already number | null due to onChange and zod schema
      last_service_mileage: values.last_service_mileage, 
      last_service_date: values.last_service_date || null,
    };

    if (initialData) {
      onSubmit({ ...dataToPass, id: initialData.id }); // Pass id when updating
    } else {
      onSubmit(dataToPass); // No id when adding
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="plate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plaque d'immatriculation</FormLabel>
              <FormControl>
                <Input placeholder="Ex: AB-123-CD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de véhicule</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Camion, Fourgonnette" {...field} />
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
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilométrage actuel</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_service_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date du dernier service</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} /> {/* Corrected: handle null/undefined */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_service_mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilométrage au dernier service</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} /> {/* Corrected: handle null/undefined */}
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
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier Véhicule' : 'Ajouter Véhicule')}
          </CustomButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default VehicleForm;