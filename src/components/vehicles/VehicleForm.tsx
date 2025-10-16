"use client";

import React, { useEffect } from "react"; // Import useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomButton } from "@/components/CustomButton";
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
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/CustomCard";
import { motion } from "framer-motion";
import { Vehicle } from "./VehicleColumns"; // Import Vehicle type
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";

// Schéma de validation pour un véhicule
const vehicleFormSchema = z.object({
  id: z.string().optional(), // Add id for editing
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
  next_maintenance_date: z.date().optional().nullable(), // New field
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface VehicleFormProps {
  onSuccess?: () => void;
  initialData?: Vehicle; // Use Vehicle type for initialData
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess, initialData }) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      year: initialData.year, // Ensure year is number
      mileage: initialData.mileage || 0, // Ensure mileage is number
      next_maintenance_date: initialData.next_maintenance_date ? new Date(initialData.next_maintenance_date) : null, // New field
    } : {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      vin: "",
      mileage: 0,
      fuel_type: "Essence",
      status: "Actif",
      next_maintenance_date: null, // New field
    },
  });

  // Reset form with initialData when it changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        year: initialData.year,
        mileage: initialData.mileage || 0,
        next_maintenance_date: initialData.next_maintenance_date ? new Date(initialData.next_maintenance_date) : null,
      });
    } else {
      form.reset({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        license_plate: "",
        vin: "",
        mileage: 0,
        fuel_type: "Essence",
        status: "Actif",
        next_maintenance_date: null,
      });
    }
  }, [initialData, form]);


  async function onSubmit(values: VehicleFormValues) {
    try {
      const payload = {
        ...values,
        next_maintenance_date: values.next_maintenance_date ? format(values.next_maintenance_date, "yyyy-MM-dd") : null,
      };

      if (initialData?.id) {
        // Update existing vehicle
        const { id, ...updateValues } = payload; // Exclude id from update payload
        const { error } = await supabase
          .from('vehicles')
          .update(updateValues)
          .eq('id', initialData.id);

        if (error) {
          throw error;
        }
        toast.success("Véhicule mis à jour avec succès !");
      } else {
        // Add new vehicle
        const { data, error } = await supabase
          .from('vehicles')
          .insert([payload]);

        if (error) {
          throw error;
        }
        toast.success("Véhicule ajouté avec succès !");
      }
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erreur lors de l'opération sur le véhicule:", error.message);
      toast.error("Erreur lors de l'opération sur le véhicule: " + error.message);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CustomCard className="p-6">
        <CustomCardHeader className="pb-4">
          <CustomCardTitle className="text-xl">Informations sur le véhicule</CustomCardTitle>
        </CustomCardHeader>
        <CustomCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="next_maintenance_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Prochaine Date de Maintenance (Optionnel)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: fr })
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton type="submit" className="w-full">
                {initialData ? "Mettre à jour le véhicule" : "Ajouter le véhicule"}
              </CustomButton>
            </form>
          </Form>
        </CustomCardContent>
      </CustomCard>
    </motion.div>
  );
};

export default VehicleForm;