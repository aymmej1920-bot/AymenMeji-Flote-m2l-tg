import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { CustomButton } from "@/components/CustomButton";
import { CustomCard, CustomCardContent } from "@/components/CustomCard";
import { Car } from "lucide-react";
import { motion } from "framer-motion"; // Import motion

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CustomCard className="text-center p-8">
          <CustomCardContent className="p-0">
            <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-4 text-foreground">Bienvenue sur Fleet Manager M2l-TG</h1> {/* Adjusted title size */}
            <p className="text-xl text-muted-foreground mb-8">
              Votre solution complète pour une gestion de flotte efficace et intelligente.
            </p>
            <CustomButton size="lg" asChild>
              <Link to="/vehicles" className="flex items-center gap-2">
                <Car className="h-5 w-5" /> Commencer la gestion des véhicules
              </Link>
            </CustomButton>
          </CustomCardContent>
        </CustomCard>
      </motion.div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;