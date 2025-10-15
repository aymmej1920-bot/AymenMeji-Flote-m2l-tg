"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

// Schéma de validation pour un véhicule
const vehicleFormSchema = z.object({
  make: z.string().min(2, {
    message: "Le fabricant doit contenir au moins 2 caractères.",
  }),
  model: z.string().min(2, {
    message: "Le modèle doit contenir au moins 2 caractères.",
  }),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1, {
    message: "L'année doit être valide.",
  }),
  license_plate: z.string().min(4, {
    message: "La plaque d'immatriculation doit contenir au moins 4 caractères.",
  }),
  vin: z.string().length(17, {
    message: "Le VIN doit contenir exactement 17 caractères.",
  }),
  mileage: z.number().int().min(0, {
    message: "Le kilométrage ne peut pas être négatif.",
  }).optional(),
  fuel_type: z.string().optional(),
  status: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  onSuccess?: () => void;
  initialData?: VehicleFormValues;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess, initialData }) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: initialData || {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      vin: "",
      mileage: 0,
      fuel_type: "Essence",
      status: "Actif",
    },
  });

  async function onSubmit(values: VehicleFormValues) {
    try {
      const { data, error } = await supabase
        .from('vehicles') // Assurez-vous que cette table existe dans Supabase
        .insert([values]);

      if (error) {
        throw error;
      }

      toast.success("Véhicule ajouté avec succès !");
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du véhicule:", error.message);
      toast.error("Erreur lors de l'ajout du véhicule: " + error.message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="make"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fabricant</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Renault" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modèle</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Clio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Année</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 2020" {...field} onChange={event => field.onChange(parseInt(event.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="license_plate"
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
          name="vin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro d'identification du véhicule (VIN)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 17 caractères" {...field} />
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
                <Input type="number" placeholder="Ex: 50000" {...field} onChange={event => field.onChange(parseInt(event.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Ajouter le véhicule</Button>
      </form>
    </Form>
  );
};

export default VehicleForm;