"use client";

import React, { useEffect } from "react";
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
import { Driver } from "./DriverColumns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Import the Button component

// Schéma de validation pour un conducteur
const driverFormSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(2, {
    message: "Le prénom doit contenir au moins 2 caractères.",
  }),
  last_name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  license_number: z.string().min(5, {
    message: "Le numéro de permis doit contenir au moins 5 caractères.",
  }),
  phone_number: z.string().optional(),
  email: z.string().email({ message: "Adresse email invalide." }).optional().or(z.literal("")),
  hire_date: z.date().optional().nullable(), // Changed to Date object
  status: z.string().optional(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

interface DriverFormProps {
  onSuccess?: () => void;
  initialData?: Driver;
}

const DriverForm: React.FC<DriverFormProps> = ({ onSuccess, initialData }) => {
  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      hire_date: initialData.hire_date ? new Date(initialData.hire_date) : null,
      email: initialData.email || "",
      phone_number: initialData.phone_number || "",
      status: initialData.status || "Actif",
    } : {
      first_name: "",
      last_name: "",
      license_number: "",
      phone_number: "",
      email: "",
      hire_date: null,
      status: "Actif",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        hire_date: initialData.hire_date ? new Date(initialData.hire_date) : null,
        email: initialData.email || "",
        phone_number: initialData.phone_number || "",
        status: initialData.status || "Actif",
      });
    } else {
      form.reset({
        first_name: "",
        last_name: "",
        license_number: "",
        phone_number: "",
        email: "",
        hire_date: null,
        status: "Actif",
      });
    }
  }, [initialData, form]);

  async function onSubmit(values: DriverFormValues) {
    try {
      const payload = {
        ...values,
        hire_date: values.hire_date ? format(values.hire_date, "yyyy-MM-dd") : null,
        email: values.email === "" ? null : values.email, // Handle empty string for optional fields
        phone_number: values.phone_number === "" ? null : values.phone_number,
      };

      if (initialData?.id) {
        const { id, ...updateValues } = payload;
        const { error } = await supabase
          .from('drivers')
          .update(updateValues)
          .eq('id', initialData.id);

        if (error) {
          throw error;
        }
        toast.success("Conducteur mis à jour avec succès !");
      } else {
        const { data, error } = await supabase
          .from('drivers')
          .insert([payload]);

        if (error) {
          throw error;
        }
        toast.success("Conducteur ajouté avec succès !");
      }
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Erreur lors de l'opération sur le conducteur:", error.message);
      toast.error("Erreur lors de l'opération sur le conducteur: " + error.message);
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
          <CustomCardTitle className="text-xl">Informations sur le conducteur</CustomCardTitle>
        </CustomCardHeader>
        <CustomCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Jean" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Dupont" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="license_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de Permis</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 0612345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: jean.dupont@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hire_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date d'embauche</FormLabel>
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
                        <SelectItem value="Actif">Actif</SelectItem>
                        <SelectItem value="Inactif">Inactif</SelectItem>
                        <SelectItem value="En congé">En congé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CustomButton type="submit" className="w-full">
                {initialData ? "Mettre à jour le conducteur" : "Ajouter le conducteur"}
              </CustomButton>
            </form>
          </Form>
        </CustomCardContent>
      </CustomCard>
    </motion.div>
  );
};

export default DriverForm;