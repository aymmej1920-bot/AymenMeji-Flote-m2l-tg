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

export type Driver = {
  id: string;
  first_name: string;
  last_name: string;
  license_number: string;
  phone_number?: string;
  email?: string;
  hire_date?: string; // ISO date string
  status?: string;
  created_at: string;
};

interface DriverColumnsProps {
  onDelete: (driver: Driver) => void;
  onEdit: (driver: Driver) => void;
}

export const columns = ({ onDelete, onEdit }: DriverColumnsProps): ColumnDef<Driver>[] => [
  {
    accessorKey: "first_name",
    header: "Prénom",
  },
  {
    accessorKey: "last_name",
    header: "Nom",
  },
  {
    accessorKey: "license_number",
    header: "Permis de Conduire",
  },
  {
    accessorKey: "phone_number",
    header: "Téléphone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "hire_date",
    header: "Date d'embauche",
    cell: ({ row }) => {
      const date = row.original.hire_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const driver = row.original;

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
                onClick={() => navigator.clipboard.writeText(driver.id)}
              >
                Copier l'ID du conducteur
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(driver)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(driver)} className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];