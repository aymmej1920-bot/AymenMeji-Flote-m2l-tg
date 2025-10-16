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
import type { Tour } from '@/hooks/useTours';
import type { Vehicle } from '@/hooks/useVehicles';
import type { Driver } from '@/hooks/useDrivers';

const tourFormSchema = z.object({
  date: z.string().min(1, "La date de la tournée est requise."),
  vehicle_id: z.string().min(1, "Le véhicule est requis."),
  driver_id: z.string().optional().nullable(),
  status: z.enum(['Planifié', 'En Cours', 'Terminé', 'Annulé'], {
    required_error: "Le statut est requis.",
  }),
  fuel_start: z.coerce.number().min(0, "Le carburant au départ doit être positif.").optional().nullable(),
  km_start: z.coerce.number().min(0, "Le kilométrage au départ doit être positif.").optional().nullable(),
  fuel_end: z.coerce.number().min(0, "Le carburant à l'arrivée doit être positif.").optional().nullable(),
  km_end: z.coerce.number().min(0, "Le kilométrage à l'arrivée doit être positif.").optional().nullable(),
  distance: z.coerce.number().min(0, "La distance doit être positive.").optional().nullable(),
});

export type TourFormValues = z.infer<typeof tourFormSchema>;

interface TourFormProps {
  initialData?: Tour;
  onSubmit: (data: TourFormValues & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  vehicles: Vehicle[];
  drivers: Driver[];
}

const TourForm: React.FC<TourFormProps> = ({ initialData, onSubmit, onCancel, isLoading, vehicles, drivers }) => {
  const form = useForm<TourFormValues>({
    resolver: zodResolver(tourFormSchema),
    defaultValues: {
      date: initialData?.date || '',
      vehicle_id: initialData?.vehicle_id || '',
      driver_id: initialData?.driver_id || '',
      status: (initialData?.status || 'Planifié') as TourFormValues['status'],
      fuel_start: initialData?.fuel_start || null,
      km_start: initialData?.km_start || null,
      fuel_end: initialData?.fuel_end || null,
      km_end: initialData?.km_end || null,
      distance: initialData?.distance || null,
    },
  });

  const handleSubmit = (values: TourFormValues) => {
    const dataToPass = {
      ...values,
      driver_id: values.driver_id || null,
      fuel_start: values.fuel_start || null,
      km_start: values.km_start || null,
      fuel_end: values.fuel_end || null,
      km_end: values.km_end || null,
      distance: values.distance || null,
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
              <FormLabel>Date de la tournée</FormLabel>
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
          name="driver_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conducteur (optionnel)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un conducteur" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Aucun</SelectItem> {/* Option for no driver */}
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
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
                  <SelectItem value="Planifié">Planifié</SelectItem>
                  <SelectItem value="En Cours">En Cours</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fuel_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carburant au départ (L)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="km_start"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilométrage au départ (km)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fuel_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carburant à l'arrivée (L)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="km_end"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kilométrage à l'arrivée (km)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="distance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance parcourue (km)</FormLabel>
              <FormControl>
                <Input type="number" {...field} value={field.value === null ? '' : field.value} onChange={e => field.onChange(e.target.value === '' ? null : Number(e.target.value))} />
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
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier Tournée' : 'Ajouter Tournée')}
          </CustomButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default TourForm;