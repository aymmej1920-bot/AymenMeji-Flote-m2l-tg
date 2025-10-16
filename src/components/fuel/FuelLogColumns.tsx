"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FuelLog = {
  id: string;
  vehicle_id: string;
  driver_id?: string;
  fill_date: string; // ISO date string
  quantity_liters: number;
  cost: number;
  odometer_reading?: number;
  fuel_type?: string;
  location?: string;
  notes?: string;
  created_at: string;
};

interface FuelLogColumnsProps {
  onDelete: (log: FuelLog) => void;
  onEdit: (log: FuelLog) => void;
}

export const columns = ({ onDelete, onEdit }: FuelLogColumnsProps): ColumnDef<FuelLog>[] => [
  {
    accessorKey: "fill_date",
    header: "Date de Remplissage",
    cell: ({ row }) => {
      const date = row.original.fill_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "quantity_liters",
    header: "Quantité (L)",
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantity_liters"));
      return <div className="text-right font-medium">{quantity.toFixed(2)} L</div>;
    },
  },
  {
    accessorKey: "cost",
    header: "Coût",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "odometer_reading",
    header: "Odomètre",
    cell: ({ row }) => {
      const odometer = row.original.odometer_reading;
      return odometer ? `${odometer} km` : "N/A";
    },
  },
  {
    accessorKey: "fuel_type",
    header: "Type de Carburant",
  },
  {
    accessorKey: "location",
    header: "Lieu",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original;

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
                onClick={() => navigator.clipboard.writeText(log.id)}
              >
                Copier l'ID du relevé
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(log)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(log)} className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];