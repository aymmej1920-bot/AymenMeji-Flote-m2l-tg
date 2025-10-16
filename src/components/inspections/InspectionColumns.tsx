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

export type Inspection = {
  id: string;
  vehicle_id?: string;
  driver_id?: string;
  inspection_date: string; // ISO date string
  inspection_type: string;
  status?: string;
  notes?: string;
  created_at: string;
};

interface InspectionColumnsProps {
  onDelete: (inspection: Inspection) => void;
  onEdit: (inspection: Inspection) => void;
}

export const columns = ({ onDelete, onEdit }: InspectionColumnsProps): ColumnDef<Inspection>[] => [
  {
    accessorKey: "inspection_date",
    header: "Date d'Inspection",
    cell: ({ row }) => {
      const date = row.original.inspection_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "inspection_type",
    header: "Type d'Inspection",
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
      const inspection = row.original;

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
                onClick={() => navigator.clipboard.writeText(inspection.id)}
              >
                Copier l'ID de l'inspection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(inspection)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(inspection)} className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];