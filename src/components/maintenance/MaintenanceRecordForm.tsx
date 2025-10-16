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
import type { MaintenanceRecord } from '@/hooks/useMaintenanceRecords';
import type { Vehicle } from '@/hooks/useVehicles';

const maintenanceRecordFormSchema = z.object({
  vehicle_id: z.string().min(1, "Le véhicule est requis."),
  type: z.string().min(1, "Le type de maintenance est requis."),
  date: z.string().min(1, "La date de maintenance est requise."),
  mileage: z.coerce.number().min(0, "Le kilométrage doit être positif."),
  cost: z.coerce.number().min(0, "Le coût doit être positif."),
});

export type MaintenanceRecordFormValues = z.infer<typeof maintenanceRecordFormSchema>;

interface MaintenanceRecordFormProps {
  initialData?: MaintenanceRecord;
  onSubmit: (data: MaintenanceRecordFormValues & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  vehicles: Vehicle[];
}

const MaintenanceRecordForm: React.FC<MaintenanceRecordFormProps> = ({ initialData, onSubmit, onCancel, isLoading, vehicles }) => {
  const form = useForm<MaintenanceRecordFormValues>({
    resolver: zodResolver(maintenanceRecordFormSchema),
    defaultValues: {
      vehicle_id: initialData?.vehicle_id || '',
      type: initialData?.type || '',
      date: initialData?.date || '',
      mileage: initialData?.mileage || 0,
      cost: initialData?.cost || 0,
    },
  });

  const handleSubmit = (values: MaintenanceRecordFormValues) => {
    if (initialData) {
      onSubmit({ ...values, id: initialData.id });
    } else {
      onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="vehicle_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Véhicule</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un véhicule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} ({vehicle.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de maintenance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vidange">Vidange</SelectItem>
                  <SelectItem value="Freins">Freins</SelectItem>
                  <SelectItem value="Pneus">Pneus</SelectItem>
                  <SelectItem value="Réparation">Réparation</SelectItem>
                  <SelectItem value="Contrôle Technique">Contrôle Technique</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de maintenance</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mileage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kilométrage</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coût (TND)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
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
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier Maintenance' : 'Ajouter Maintenance')}
          </CustomButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default MaintenanceRecordForm;