"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion"; // Import motion

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Définition du type pour un véhicule (à adapter à votre schéma Supabase)
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin: string;
  mileage?: number;
  fuel_type?: string;
  status?: string;
  created_at: string;
};

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "make",
    header: "Fabricant",
  },
  {
    accessorKey: "model",
    header: "Modèle",
  },
  {
    accessorKey: "year",
    header: "Année",
  },
  {
    accessorKey: "license_plate",
    header: "Plaque d'immatriculation",
  },
  {
    accessorKey: "vin",
    header: "VIN",
  },
  {
    accessorKey: "mileage",
    header: "Kilométrage",
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(vehicle.id)}
              >
                Copier l'ID du véhicule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Voir les détails</DropdownMenuItem>
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];