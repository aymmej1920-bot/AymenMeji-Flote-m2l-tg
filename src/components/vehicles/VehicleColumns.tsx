"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  next_maintenance_date?: string; // New field
  created_at: string;
};

interface VehicleColumnsProps {
  onDelete: (vehicle: Vehicle) => void;
  onEdit: (vehicle: Vehicle) => void; // Add onEdit prop
}

export const columns = ({ onDelete, onEdit }: VehicleColumnsProps): ColumnDef<Vehicle>[] => [
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
              <DropdownMenuItem onClick={() => onEdit(vehicle)}>Modifier</DropdownMenuItem> {/* Call onEdit */}
              <DropdownMenuItem onClick={() => onDelete(vehicle)} className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];