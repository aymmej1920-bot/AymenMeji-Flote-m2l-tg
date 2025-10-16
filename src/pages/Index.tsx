import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { CustomButton } from "@/components/CustomButton"; // Utiliser CustomButton
import { CustomCard, CustomCardContent } from "@/components/CustomCard"; // Utiliser CustomCard
import { Car } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-light-grey"> {/* Utiliser light-grey */}
      <CustomCard className="text-center p-8"> {/* Utiliser CustomCard */}
        <CustomCardContent className="p-0"> {/* Retirer le padding par défaut de CustomCardContent si nécessaire */}
          <h1 className="text-5xl font-heading font-extrabold mb-4 text-night-blue">Bienvenue sur Fleet Manager</h1> {/* Utiliser font-heading et night-blue */}
          <p className="text-xl text-dark-grey mb-8"> {/* Utiliser dark-grey */}
            Votre solution complète pour une gestion de flotte efficace et intelligente.
          </p>
          <CustomButton size="lg" asChild>
            <Link to="/vehicles" className="flex items-center gap-2">
              <Car className="h-5 w-5" /> Commencer la gestion des véhicules
            </Link>
          </CustomButton>
        </CustomCardContent>
      </CustomCard>
      <MadeWithDyad />
    </div>
  );
};

export default Index;