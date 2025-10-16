"use client";

import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase, auth } from "@/lib/supabase";
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from "@/components/CustomCard";
import { motion } from "framer-motion";
import { MaintenanceRecord } from "./MaintenanceColumns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/components/vehicles/VehicleColumns";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks

// Schéma de validation pour un enregistrement de maintenance
const maintenanceFormSchema = z.object({
  id: z.string().optional(),
  vehicle_id: z.string().min(1, { message: "Veuillez sélectionner un véhicule." }),
  description: z.string().min(5, {
    message: "La description doit contenir au moins 5 caractères.",
  }),
  maintenance_date: z.date({
    required_error: "Une date de maintenance est requise.",
  }),
  cost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Le coût ne peut pas être négatif." }).optional()
  ),
  status: z.string().optional(),
  notes: z.string().optional(),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

interface MaintenanceFormProps {
  onSuccess?: () => void;
  initialData?: MaintenanceRecord;
}

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({ onSuccess, initialData }) => {
  const queryClient = useQueryClient();
  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      maintenance_date: new Date(initialData.maintenance_date),
      cost: initialData.cost || undefined,
      status: initialData.status || "Planifié",
      notes: initialData.notes || "",
    } : {
      vehicle_id: "",
      description: "",
      maintenance_date: new Date(),
      cost: undefined,
      status: "Planifié",
      notes: "",
    },
  });

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les véhicules.");
    }
    return user.id;
  };

  // Fetch vehicles using React Query
  const { data: vehicles, isLoading: isLoadingVehicles, error: vehiclesError } = useQuery<Vehicle[], Error>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('vehicles')
        .select('id, make, model, license_plate')
        .eq('user_id', userId);
      if (error) throw error;
      return data as Vehicle[];
    },
  });

  useEffect(() => {
    if (vehiclesError) {
      toast.error("Erreur lors du chargement des véhicules: " + vehiclesError.message);
    }
  }, [vehiclesError]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        maintenance_date: new Date(initialData.maintenance_date),
        cost: initialData.cost || undefined,
        status: initialData.status || "Planifié",
        notes: initialData.notes || "",
      });
    } else {
      form.reset({
        vehicle_id: "",
        description: "",
        maintenance_date: new Date(),
        cost: undefined,
        status: "Planifié",
        notes: "",
      });
    }
  }, [initialData, form]);

  const addUpdateMaintenanceMutation = useMutation<void, Error, MaintenanceFormValues>({
    mutationFn: async (values: MaintenanceFormValues) => {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour effectuer cette action.");
      }

      const payload = {
        ...values,
        maintenance_date: format(values.maintenance_date, "yyyy-MM-dd"),
        cost: values.cost || null,
        notes: values.notes === "" ? null : values.notes,
        user_id: user.id,
      };

      if (initialData?.id) {
        const { id, ...updateValues } = payload;
        const { error } = await supabase
          .from('maintenance_records')
          .update(updateValues)
          .eq('id', initialData.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('maintenance_records')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(initialData ? "Enregistrement de maintenance mis à jour avec succès !" : "Enregistrement de maintenance ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ['maintenanceRecords'] });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => {
      console.error("Erreur lors de l'opération sur l'enregistrement de maintenance:", err.message);
      toast.error("Erreur lors de l'opération sur l'enregistrement de maintenance: " + err.message);
    },
  });

  function onSubmit(values: MaintenanceFormValues) {
    addUpdateMaintenanceMutation.mutate(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CustomCard className="p-6">
        <CustomCardHeader className="pb-4">
          <CustomCardTitle className="text-xl">Informations sur la Maintenance</CustomCardTitle>
        </CustomCardHeader>
        <CustomCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger disabled={isLoadingVehicles}>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles?.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} ({vehicle.license_plate})
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Vidange d'huile, remplacement des freins..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maintenance_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de Maintenance</FormLabel>
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
                          selected={field.value}
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
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coût (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ex: 150.00" {...field} />
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
                        <SelectItem value="Planifié">Planifié</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Terminé">Terminé</SelectItem>
                        <SelectItem value="Annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notes supplémentaires sur la maintenance..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton type="submit" className="w-full" disabled={addUpdateMaintenanceMutation.isPending}>
                {addUpdateMaintenanceMutation.isPending ? "Chargement..." : (initialData ? "Mettre à jour l'enregistrement" : "Ajouter l'enregistrement")}
              </CustomButton>
            </form>
          </Form>
        </CustomCardContent>
      </CustomCard>
    </motion.div>
  );
};

export default MaintenanceForm;