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
import { Inspection } from "./InspectionColumns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/components/vehicles/VehicleColumns";
import { Driver } from "@/components/drivers/DriverColumns";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Import React Query hooks

// Schéma de validation pour une inspection
const inspectionFormSchema = z.object({
  id: z.string().optional(),
  vehicle_id: z.string().optional().nullable(),
  driver_id: z.string().optional().nullable(),
  inspection_date: z.date({
    required_error: "Une date d'inspection est requise.",
  }),
  inspection_type: z.string().min(1, { message: "Veuillez sélectionner un type d'inspection." }),
  status: z.string().optional(),
  notes: z.string().optional(),
});

type InspectionFormValues = z.infer<typeof inspectionFormSchema>;

interface InspectionFormProps {
  onSuccess?: () => void;
  initialData?: Inspection;
}

const InspectionForm: React.FC<InspectionFormProps> = ({ onSuccess, initialData }) => {
  const queryClient = useQueryClient();
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      inspection_date: new Date(initialData.inspection_date),
      vehicle_id: initialData.vehicle_id || null,
      driver_id: initialData.driver_id || null,
      status: initialData.status || "Planifiée",
      notes: initialData.notes || "",
    } : {
      vehicle_id: null,
      driver_id: null,
      inspection_date: new Date(),
      inspection_type: "",
      status: "Planifiée",
      notes: "",
    },
  });

  const getUserId = async () => {
    const { data: { user } } = await auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir les données.");
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

  // Fetch drivers using React Query
  const { data: drivers, isLoading: isLoadingDrivers, error: driversError } = useQuery<Driver[], Error>({
    queryKey: ['drivers'],
    queryFn: async () => {
      const userId = await getUserId();
      const { data, error } = await supabase
        .from('drivers')
        .select('id, first_name, last_name')
        .eq('user_id', userId);
      if (error) throw error;
      return data as Driver[];
    },
  });

  useEffect(() => {
    if (vehiclesError) {
      toast.error("Erreur lors du chargement des véhicules: " + vehiclesError.message);
    }
    if (driversError) {
      toast.error("Erreur lors du chargement des conducteurs: " + driversError.message);
    }
  }, [vehiclesError, driversError]);

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        inspection_date: new Date(initialData.inspection_date),
        vehicle_id: initialData.vehicle_id || null,
        driver_id: initialData.driver_id || null,
        status: initialData.status || "Planifiée",
        notes: initialData.notes || "",
      });
    } else {
      form.reset({
        vehicle_id: null,
        driver_id: null,
        inspection_date: new Date(),
        inspection_type: "",
        status: "Planifiée",
        notes: "",
      });
    }
  }, [initialData, form]);

  const addUpdateInspectionMutation = useMutation<void, Error, InspectionFormValues>({
    mutationFn: async (values: InspectionFormValues) => {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour effectuer cette action.");
      }

      const payload = {
        ...values,
        inspection_date: format(values.inspection_date, "yyyy-MM-dd"),
        vehicle_id: values.vehicle_id || null,
        driver_id: values.driver_id || null,
        notes: values.notes === "" ? null : values.notes,
        user_id: user.id,
      };

      if (initialData?.id) {
        const { id, ...updateValues } = payload;
        const { error } = await supabase
          .from('inspections')
          .update(updateValues)
          .eq('id', initialData.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('inspections')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(initialData ? "Inspection mise à jour avec succès !" : "Inspection ajoutée avec succès !");
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => {
      console.error("Erreur lors de l'opération sur l'inspection:", err.message);
      toast.error("Erreur lors de l'opération sur l'inspection: " + err.message);
    },
  });

  function onSubmit(values: InspectionFormValues) {
    addUpdateInspectionMutation.mutate(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CustomCard className="p-6">
        <CustomCardHeader className="pb-4">
          <CustomCardTitle className="text-xl">Informations sur l'Inspection</CustomCardTitle>
        </CustomCardHeader>
        <CustomCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="vehicle_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule Associé (Optionnel)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "" ? null : value)} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger disabled={isLoadingVehicles}>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Aucun</SelectItem>
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
                name="driver_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conducteur Associé (Optionnel)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "" ? null : value)} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger disabled={isLoadingDrivers}>
                          <SelectValue placeholder="Sélectionner un conducteur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Aucun</SelectItem>
                        {drivers?.map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.first_name} {driver.last_name}
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
                name="inspection_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'Inspection</FormLabel>
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
                name="inspection_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'Inspection</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type d'inspection" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pré-départ">Pré-départ</SelectItem>
                        <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                        <SelectItem value="Annuelle">Annuelle</SelectItem>
                        <SelectItem value="Sécurité">Sécurité</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
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
                        <SelectItem value="Planifiée">Planifiée</SelectItem>
                        <SelectItem value="En cours">En cours</SelectItem>
                        <SelectItem value="Terminée">Terminée</SelectItem>
                        <SelectItem value="Non conforme">Non conforme</SelectItem>
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
                    <FormLabel>Notes (Optionnel)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notes supplémentaires sur l'inspection..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton type="submit" className="w-full" disabled={addUpdateInspectionMutation.isPending}>
                {addUpdateInspectionMutation.isPending ? "Chargement..." : (initialData ? "Mettre à jour l'inspection" : "Ajouter l'inspection")}
              </CustomButton>
            </form>
          </Form>
        </CustomCardContent>
      </CustomCard>
    </motion.div>
  );
};

export default InspectionForm;