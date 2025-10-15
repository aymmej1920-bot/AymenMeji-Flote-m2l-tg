import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-background">
      <div className="text-center p-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 text-primary">Bienvenue sur Fleet Manager</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Votre solution complète pour une gestion de flotte efficace et intelligente.
        </p>
        <Button size="lg" asChild>
          <Link to="/vehicles" className="flex items-center gap-2">
            <Car className="h-5 w-5" /> Commencer la gestion des véhicules
          </Link>
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;