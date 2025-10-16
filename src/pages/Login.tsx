"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CustomCard, CustomCardContent, CustomCardHeader, CustomCardTitle } from '@/components/CustomCard';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is signed in, redirect to dashboard
        toast.success("Connexion réussie ! Redirection vers le tableau de bord.");
        navigate('/dashboard');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <CustomCard className="p-6">
          <CustomCardHeader className="text-center">
            <CustomCardTitle className="text-3xl font-heading text-foreground">
              Connexion à Fleet Manager
            </CustomCardTitle>
          </CustomCardHeader>
          <CustomCardContent>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]} // No third-party providers unless specified
              theme="light" // Use light theme by default, can be adjusted for dark mode
              redirectTo={window.location.origin + '/dashboard'} // Redirect to dashboard after login
              localization={{
                variables: {
                  sign_in: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Votre mot de passe',
                    button_label: 'Se connecter',
                    social_provider_text: 'Se connecter avec {{provider}}',
                    link_text: 'Déjà un compte ? Connectez-vous',
                  },
                  sign_up: {
                    email_label: 'Adresse email',
                    password_label: 'Mot de passe',
                    email_input_placeholder: 'Votre adresse email',
                    password_input_placeholder: 'Votre mot de passe',
                    button_label: 'S\'inscrire',
                    social_provider_text: 'S\'inscrire avec {{provider}}',
                    link_text: 'Pas encore de compte ? Inscrivez-vous',
                  },
                  forgotten_password: {
                    email_label: 'Adresse email',
                    password_reset_button_label: 'Envoyer les instructions de réinitialisation',
                    link_text: 'Mot de passe oublié ?',
                    email_input_placeholder: 'Votre adresse email',
                  },
                  update_password: {
                    password_label: 'Nouveau mot de passe',
                    password_input_placeholder: 'Votre nouveau mot de passe',
                    button_label: 'Mettre à jour le mot de passe',
                  },
                },
              }}
            />
          </CustomCardContent>
        </CustomCard>
      </motion.div>
    </div>
  );
};

export default Login;