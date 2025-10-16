"use client";

import React from 'react';
import { CustomCard, CustomCardHeader, CustomCardTitle, CustomCardContent } from '@/components/CustomCard';
import { BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-heading font-bold text-foreground"
      >
        Rapports
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CustomCard className="p-6 text-center">
          <CustomCardHeader>
            <BarChart2 className="h-12 w-12 text-primary mx-auto mb-4" />
            <CustomCardTitle>Page des Rapports</CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent>
            <p className="text-muted-foreground">
              Cette page est en cours de développement. Revenez bientôt pour consulter vos rapports !
            </p>
          </CustomCardContent>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Reports;