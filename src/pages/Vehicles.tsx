import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

const Vehicles: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Véhicules</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Véhicule
        </Button>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <p className="text-muted-foreground">
          Liste des véhicules à venir ici...
        </p>
      </div>
    </div>
  );
};

export default Vehicles;