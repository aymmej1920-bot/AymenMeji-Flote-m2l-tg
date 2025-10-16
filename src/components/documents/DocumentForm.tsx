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
import type { Document } from '@/hooks/useDocuments';
import type { Vehicle } from '@/hooks/useVehicles';

const documentFormSchema = z.object({
  vehicle_id: z.string().min(1, "Le véhicule est requis."),
  type: z.string().min(1, "Le type de document est requis."),
  number: z.string().min(1, "Le numéro de document est requis."),
  expiration: z.string().min(1, "La date d'expiration est requise."),
});

export type DocumentFormValues = z.infer<typeof documentFormSchema>;

interface DocumentFormProps {
  initialData?: Document;
  onSubmit: (data: DocumentFormValues & { id?: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  vehicles: Vehicle[];
}

const DocumentForm: React.FC<DocumentFormProps> = ({ initialData, onSubmit, onCancel, isLoading, vehicles }) => {
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      vehicle_id: initialData?.vehicle_id || '',
      type: initialData?.type || '',
      number: initialData?.number || '',
      expiration: initialData?.expiration || '',
    },
  });

  const handleSubmit = (values: DocumentFormValues) => {
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
              <FormLabel>Type de document</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Assurance">Assurance</SelectItem>
                  <SelectItem value="Carte Grise">Carte Grise</SelectItem>
                  <SelectItem value="Contrôle Technique">Contrôle Technique</SelectItem>
                  <SelectItem value="Permis de Conduire">Permis de Conduire</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de document</FormLabel>
              <FormControl>
                <Input placeholder="Ex: ABC123XYZ" {...field} />
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
              <FormLabel>Date d'expiration</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value || ''} />
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
            {isLoading ? 'Chargement...' : (initialData ? 'Modifier Document' : 'Ajouter Document')}
          </CustomButton>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DocumentForm;