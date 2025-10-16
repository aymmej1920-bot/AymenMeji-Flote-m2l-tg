"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const CustomCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card/90 text-card-foreground shadow-lg backdrop-blur-sm", // Adjusted for glassmorphism
      className
    )}
    {...props}
  />
));
CustomCard.displayName = "CustomCard";

const CustomCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CustomCardHeader.displayName = "CustomCardHeader";

const CustomCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-heading text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CustomCardTitle.displayName = "CustomCardTitle";

const CustomCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CustomCardDescription.displayName = "CustomCardDescription";

const CustomCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CustomCardContent.displayName = "CustomCardContent";

const CustomCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CustomCardFooter.displayName = "CustomCardFooter";

export { CustomCard, CustomCardHeader, CustomCardFooter, CustomCardTitle, CustomCardDescription, CustomCardContent };