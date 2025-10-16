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

export type Tour = {
  id: string;
  name: string;
  start_date: string; // ISO date string
  end_date?: string; // ISO date string, nullable
  vehicle_id?: string;
  driver_id?: string;
  status?: string;
  notes?: string;
  created_at: string;
};

interface TourColumnsProps {
  onDelete: (tour: Tour) => void;
  onEdit: (tour: Tour) => void;
}

export const columns = ({ onDelete, onEdit }: TourColumnsProps): ColumnDef<Tour>[] => [
  {
    accessorKey: "name",
    header: "Nom de la Tournée",
  },
  {
    accessorKey: "start_date",
    header: "Date de Début",
    cell: ({ row }) => {
      const date = row.original.start_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "end_date",
    header: "Date de Fin",
    cell: ({ row }) => {
      const date = row.original.end_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tour = row.original;

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
                onClick={() => navigator.clipboard.writeText(tour.id)}
              >
                Copier l'ID de la tournée
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(tour)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(tour)} className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];