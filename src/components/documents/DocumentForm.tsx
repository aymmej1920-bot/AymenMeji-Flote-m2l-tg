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
import { Document } from "./DocumentColumns";
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

// Schéma de validation pour un document
const documentFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  document_type: z.string().min(1, { message: "Veuillez sélectionner un type de document." }),
  issue_date: z.date({
    required_error: "Une date d'émission est requise.",
  }),
  expiry_date: z.date().optional().nullable(),
  file_url: z.string().url({ message: "L'URL du fichier doit être valide." }).optional().or(z.literal("")),
  vehicle_id: z.string().optional().nullable(),
  driver_id: z.string().optional().nullable(),
  notes: z.string().optional(),
});

type DocumentFormValues = z.infer<typeof documentFormSchema>;

interface DocumentFormProps {
  onSuccess?: () => void;
  initialData?: Document;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ onSuccess, initialData }) => {
  const queryClient = useQueryClient();
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      issue_date: new Date(initialData.issue_date),
      expiry_date: initialData.expiry_date ? new Date(initialData.expiry_date) : null,
      file_url: initialData.file_url || "",
      vehicle_id: initialData.vehicle_id || null,
      driver_id: initialData.driver_id || null,
      notes: initialData.notes || "",
    } : {
      title: "",
      document_type: "",
      issue_date: new Date(),
      expiry_date: null,
      file_url: "",
      vehicle_id: null,
      driver_id: null,
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
        issue_date: new Date(initialData.issue_date),
        expiry_date: initialData.expiry_date ? new Date(initialData.expiry_date) : null,
        file_url: initialData.file_url || "",
        vehicle_id: initialData.vehicle_id || null,
        driver_id: initialData.driver_id || null,
        notes: initialData.notes || "",
      });
    } else {
      form.reset({
        title: "",
        document_type: "",
        issue_date: new Date(),
        expiry_date: null,
        file_url: "",
        vehicle_id: null,
        driver_id: null,
        notes: "",
      });
    }
  }, [initialData, form]);

  const addUpdateDocumentMutation = useMutation<void, Error, DocumentFormValues>({
    mutationFn: async (values: DocumentFormValues) => {
      const { data: { user } } = await auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour effectuer cette action.");
      }

      const payload = {
        ...values,
        issue_date: format(values.issue_date, "yyyy-MM-dd"),
        expiry_date: values.expiry_date ? format(values.expiry_date, "yyyy-MM-dd") : null,
        file_url: values.file_url === "" ? null : values.file_url,
        vehicle_id: values.vehicle_id || null,
        driver_id: values.driver_id || null,
        notes: values.notes === "" ? null : values.notes,
        user_id: user.id,
      };

      if (initialData?.id) {
        const { id, ...updateValues } = payload;
        const { error } = await supabase
          .from('documents')
          .update(updateValues)
          .eq('id', initialData.id)
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('documents')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(initialData ? "Document mis à jour avec succès !" : "Document ajouté avec succès !");
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      form.reset();
      onSuccess?.();
    },
    onError: (err) => {
      console.error("Erreur lors de l'opération sur le document:", err.message);
      toast.error("Erreur lors de l'opération sur le document: " + err.message);
    },
  });

  function onSubmit(values: DocumentFormValues) {
    addUpdateDocumentMutation.mutate(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CustomCard className="p-6">
        <CustomCardHeader className="pb-4">
          <CustomCardTitle className="text-xl">Informations sur le Document</CustomCardTitle>
        </CustomCardHeader>
        <CustomCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Certificat d'immatriculation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de Document</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Immatriculation">Immatriculation</SelectItem>
                        <SelectItem value="Assurance">Assurance</SelectItem>
                        <SelectItem value="Permis">Permis</SelectItem>
                        <SelectItem value="Facture">Facture</SelectItem>
                        <SelectItem value="Rapport d'accident">Rapport d'accident</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="issue_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'Émission</FormLabel>
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
                name="expiry_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'Expiration (Optionnel)</FormLabel>
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
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL du Fichier (Optionnel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: https://example.com/document.pdf" {...field} />
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
                    <FormLabel>Véhicule Associé (Optionnel)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none-selected" ? null : value)} defaultValue={field.value || "none-selected"}>
                      <FormControl>
                        <SelectTrigger disabled={isLoadingVehicles}>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none-selected">Aucun</SelectItem>
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
                    <Select onValueChange={(value) => field.onChange(value === "none-selected" ? null : value)} defaultValue={field.value || "none-selected"}>
                      <FormControl>
                        <SelectTrigger disabled={isLoadingDrivers}>
                          <SelectValue placeholder="Sélectionner un conducteur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none-selected">Aucun</SelectItem>
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optionnel)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Notes supplémentaires sur le document..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton type="submit" className="w-full" disabled={addUpdateDocumentMutation.isPending}>
                {addUpdateDocumentMutation.isPending ? "Chargement..." : (initialData ? "Mettre à jour le document" : "Ajouter le document")}
              </CustomButton>
            </form>
          </Form>
        </CustomCardContent>
      </CustomCard>
    </motion.div>
  );
};

export default DocumentForm;