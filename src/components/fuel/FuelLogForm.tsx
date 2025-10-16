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
import type { FuelLog } from '@/hooks/useFuelLogs';
import type { Vehicle } from '@/hooks/useVehicles';

const fuelLogFormSchema = z.object({
  date: z.string().min(1, "La date est requise."),
  vehicle_id: z.string().min(1, "Le véhicule est requis."),
  liters: z.coerce.number().min(0.01, "Les litres doivent être positifs."),
  price_per_liter: z.coerce.number().min(0.01, "Le prix par litre doit être positif."),
  mileage: z.coerce.number().min(0, "Le kilométrage doit être positif."),
});

export type FuelLogFormValues = z.infer<typeof fuelLogFormSchema>;

interface FuelLogFormProps {
  initialData?: FuelLog;
  onSubmit: (data: FuelLogFormValues & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  vehicles: Vehicle[];
}

const FuelLogForm: React.FC<FuelLogFormProps> = ({ initialData, onSubmit, onCancel, isLoading, vehicles }) => {
  const form = useForm<FuelLogFormValues>({
    resolver: zodResolver(fuelLogFormSchema),
    defaultValues: {
      date: initialData?.date || '',
      vehicle_id: initialData?.vehicle_id || '',
      liters: initialData?.liters || 0,
      price_per_liter: initialData?.price_per_liter || 0,
      mileage: initialData?.mileage || 0,
    },
  });

  const handleSubmit = (values: FuelLogFormValues) => {
    const cost = values.liters * values.price_per_liter;
    const dataToPass = {
      ...values,
      cost: parseFloat(cost.toFixed(2)), // Calculate cost and fix to 2 decimal places
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
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date du plein</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="liters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Litres</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price_per_liter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix par litre (TND)</FormLabel>
              <FormControl>
                <Input type="number" step="0.001" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
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
        <DialogFooter className="mt-6">
          <CustomButton variant="outline" onClick={onCancel} type="button" disabled={isLoading}>
            Annuler
          </CustomButton>
          <CustomButton type="submit" disabled={isLoading}>
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier Plein' : 'Ajouter Plein')}
          </CustomButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default FuelLogForm;