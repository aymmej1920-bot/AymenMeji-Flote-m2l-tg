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
import { FuelLog } from "./FuelLogColumns";
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

// Schéma de validation pour un relevé de carburant
const fuelLogFormSchema = z.object({
  id: z.string().optional(),
  vehicle_id: z.string().min(1, { message: "Veuillez sélectionner un véhicule." }),
  driver_id: z.string().optional().nullable(),
  fill_date: z.date({
    required_error: "Une date de remplissage est requise.",
  }),
  quantity_liters: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0.01, { message: "La quantité doit être supérieure à 0." })
  ),
  cost: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Le coût ne peut pas être négatif." })
  ),
  odometer_reading: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().min(0, { message: "L'odomètre ne peut pas être négatif." }).optional().nullable()
  ),
  fuel_type: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type FuelLogFormValues = z.infer<typeof fuelLogFormSchema>;

interface FuelLogFormProps {
  onSuccess?: () => void;
  initialData?: FuelLog;
}

const FuelLogForm: React.FC<FuelLogFormProps> = ({ onSuccess, initialData }) => {
  const queryClient = useQueryClient();
  const form = useForm<FuelLogFormValues>({
    resolver: zodResolver(fuelLogFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      fill_date: new Date(initialData.fill_date),
      quantity_liters: initialData.quantity_liters,
      cost: initialData.cost,
      odometer_reading: initialData.odometer_reading || null,
      fuel_type: initialData.fuel_type || "Essence",
      location: initialData.location || "",
      notes: initialData.notes || "",
      driver_id: initialData.driver_id || null,
    } : {
      vehicle_id: "",
      driver_id: null,
      fill_date: new Date(),
      quantity_liters: 0,
      cost: 0,
      odometer_reading: null,
      fuel_type: "Essence",
      location: "",
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
        fill_date: new Date(initialData.fill_date),
        quantity_liters: initialData.quantity_liters,
        cost: initialData.cost,
        odometer_reading: initialData.odometer_reading || null,
        fuel_type: initialData.fuel_type || "Essence",
        location: initialData.location || "",
        notes: initialData.notes || "",
        driver_id: initialData.driver_id || null,
      });
    } else {
      form.reset({
        vehicle_id: "",
        driver_id: null,
        fill_date: new Date(),
        quantity_liters: 0,
        cost: 0,
        odometer_reading: null,
        fuel_type: "Essence",
        location: "",
        notes: "",
      });
    }
  }, [initialData, form]);

  const addUpdateFuelLogMutation = useMutation<void, Error, FuelLogFormValues>({
    mutationFn: async (values: FuelLogFormValues) => {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour effectuer cette action.");
      }

      const payload = {
        ...values,
        fill_date: format(values.fill_date, "yyyy-MM-dd"),
        odometer_reading: values.odometer_reading || null,
        driver_id: values.driver_id || null,
        location: values.location === "" ? null : values.location,
        notes: values.notes === "" ? null : values.notes,
        user_id: user.id,
      };

      if (initialData?.id) {
        const { id, ...updateValues } = payload;
        const { error } = await supabase
          .from('fuel_logs')
          .update(updateValues)
          .eq('id', initialData.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('fuel_logs')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(initialData ? "Relevé de carburant mis à jour avec succès !" : "Relevé de carburant ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ['fuelLogs'] });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => {
      console.error("Erreur lors de l'opération sur le relevé de carburant:", err.message);
      toast.error("Erreur lors de l'opération sur le relevé de carburant: " + err.message);
    },
  });

  function onSubmit(values: FuelLogFormValues) {
    addUpdateFuelLogMutation.mutate(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CustomCard className="p-6">
        <CustomCardHeader className="pb-4">
          <CustomCardTitle className="text-xl">Informations sur le Relevé de Carburant</CustomCardTitle>
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
                name="driver_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conducteur (Optionnel)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
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
                name="fill_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de Remplissage</FormLabel>
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
                name="quantity_liters"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité (Litres)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ex: 45.50" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} />
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
                    <FormLabel>Coût (€)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="Ex: 70.25" {...field} onChange={event => field.onChange(parseFloat(event.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="odometer_reading"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lecture de l'Odomètre (km)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 125000" {...field} onChange={event => field.onChange(parseInt(event.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuel_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Carburant</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type de carburant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Essence">Essence</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Électrique">Électrique</SelectItem>
                        <SelectItem value="GPL">GPL</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu de Remplissage</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Station Total, Paris" {...field} />
                    </FormControl>
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
                      <Textarea placeholder="Notes supplémentaires..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton type="submit" className="w-full" disabled={addUpdateFuelLogMutation.isPending}>
                {addUpdateFuelLogMutation.isPending ? "Chargement..." : (initialData ? "Mettre à jour le relevé" : "Ajouter le relevé")}
              </CustomButton>
            </form>
          </Form>
        </CustomCardContent>
      </CustomCard>
    </motion.div>
  );
};

export default FuelLogForm;