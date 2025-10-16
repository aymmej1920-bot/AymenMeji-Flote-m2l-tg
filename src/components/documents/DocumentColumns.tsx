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

export type Document = {
  id: string;
  title: string;
  document_type: string;
  issue_date: string; // ISO date string
  expiry_date?: string; // ISO date string, nullable
  file_url?: string;
  vehicle_id?: string;
  driver_id?: string;
  notes?: string;
  created_at: string;
};

interface DocumentColumnsProps {
  onDelete: (document: Document) => void;
  onEdit: (document: Document) => void;
}

export const columns = ({ onDelete, onEdit }: DocumentColumnsProps): ColumnDef<Document>[] => [
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "document_type",
    header: "Type de Document",
  },
  {
    accessorKey: "issue_date",
    header: "Date d'Émission",
    cell: ({ row }) => {
      const date = row.original.issue_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "expiry_date",
    header: "Date d'Expiration",
    cell: ({ row }) => {
      const date = row.original.expiry_date;
      return date ? format(new Date(date), "PPP", { locale: fr }) : "N/A";
    },
  },
  {
    accessorKey: "file_url",
    header: "Fichier",
    cell: ({ row }) => {
      const url = row.original.file_url;
      return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          Voir le fichier
        </a>
      ) : (
        "N/A"
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const document = row.original;

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
                onClick={() => navigator.clipboard.writeText(document.id)}
              >
                Copier l'ID du document
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(document)}>Modifier</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(document)} className="text-destructive">Supprimer</DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];