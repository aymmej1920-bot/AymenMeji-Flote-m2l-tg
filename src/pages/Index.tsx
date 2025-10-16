import { Link } from "react-router-dom";
import { CustomButton } from "@/components/CustomButton";
import { CustomCard, CustomCardContent } from "@/components/CustomCard";
import { Car } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CustomCard className="text-center p-8 professional-shadow">
          <CustomCardContent className="p-0">
            <h1 className="text-3xl md:text-4xl font-heading font-semibold mb-4 text-text-main">Bienvenue sur Fleet Manager Pro</h1>
            <p className="text-xl text-text-secondary mb-8">
              Votre solution complète pour une gestion de flotte efficace et intelligente.
            </p>
            <CustomButton size="lg" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                <Car className="h-5 w-5" /> Accéder au Tableau de Bord
              </Link>
            </CustomButton>
          </CustomCardContent>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Index;