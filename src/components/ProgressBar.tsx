"use client";

import React from 'react';
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="relative h-4 w-full rounded-full bg-muted">
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">{value}%</p>
    </div>
  );
};

export default ProgressBar;