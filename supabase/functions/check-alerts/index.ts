import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Définition des types pour les données de la base de données
interface Vehicle {
  id: string;
  make: string;
  model: string;
  license_plate: string;
  next_maintenance_date: string | null;
  user_id: string;
}

interface Document {
  id: string;
  title: string;
  document_type: string;
  expiry_date: string | null;
  vehicle_id: string | null;
  driver_id: string | null;
  user_id: string;
}

interface Driver {
  id: string;
  first_name: string;
  last_name: string;
}

interface Notification {
  id: string;
  related_entity_id: string | null;
  related_entity_type: string | null;
  status: 'unread' | 'read' | 'archived';
  user_id: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', 
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    const sevenDaysFromNowISO = sevenDaysFromNow.toISOString().split('T')[0];

    // --- Check for Maintenance Due ---
    const { data: vehicles, error: vehicleError } = await supabaseClient
      .from('vehicles')
      .select('id, make, model, license_plate, next_maintenance_date, user_id')
      .not('next_maintenance_date', 'is', null)
      .lte('next_maintenance_date', sevenDaysFromNowISO);

    if (vehicleError) {
      console.error('Error fetching vehicles for maintenance check:', vehicleError);
    } else {
      for (const vehicle of vehicles as Vehicle[]) {
        const { data: existingNotification } = await supabaseClient
          .from('notifications')
          .select('id')
          .eq('related_entity_id', vehicle.id)
          .eq('related_entity_type', 'maintenance')
          .eq('status', 'unread')
          .eq('user_id', vehicle.user_id)
          .ilike('message', `%maintenance pour le véhicule ${vehicle.license_plate}%`)
          .limit(1);

        if (!existingNotification || existingNotification.length === 0) {
          const { error: insertError } = await supabaseClient
            .from('notifications')
            .insert({
              title: `Maintenance due pour ${vehicle.make} ${vehicle.model}`,
              message: `La maintenance pour le véhicule ${vehicle.license_plate} est prévue pour le ${vehicle.next_maintenance_date}.`,
              type: 'warning',
              status: 'unread',
              related_entity_id: vehicle.id,
              related_entity_type: 'maintenance',
              user_id: vehicle.user_id,
            });
          if (insertError) console.error('Error inserting maintenance notification:', insertError);
        }
      }
    }

    // --- Check for Expiring Documents ---
    const { data: documents, error: documentError } = await supabaseClient
      .from('documents')
      .select('id, title, document_type, expiry_date, vehicle_id, driver_id, user_id')
      .not('expiry_date', 'is', null)
      .lte('expiry_date', sevenDaysFromNowISO);

    if (documentError) {
      console.error('Error fetching documents for expiry check:', documentError);
    } else {
      for (const doc of documents as Document[]) {
        const { data: existingNotification } = await supabaseClient
          .from('notifications')
          .select('id')
          .eq('related_entity_id', doc.id)
          .eq('related_entity_type', 'document')
          .eq('status', 'unread')
          .eq('user_id', doc.user_id)
          .ilike('message', `%document "${doc.title}"%`)
          .limit(1);

        if (!existingNotification || existingNotification.length === 0) {
          let entityName = '';
          if (doc.vehicle_id) {
            const { data: vehicleData } = await supabaseClient.from('vehicles').select('license_plate').eq('id', doc.vehicle_id).single();
            entityName = vehicleData ? `véhicule ${vehicleData.license_plate}` : '';
          } else if (doc.driver_id) {
            const { data: driverData } = await supabaseClient.from('drivers').select('first_name, last_name').eq('id', doc.driver_id).single();
            entityName = driverData ? `conducteur ${driverData.first_name} ${driverData.last_name}` : '';
          }

          const { error: insertError } = await supabaseClient
            .from('notifications')
            .insert({
              title: `Document expiré ou proche de l'expiration: ${doc.title}`,
              message: `Le document "${doc.title}" (${doc.document_type}) pour ${entityName} expire le ${doc.expiry_date}.`,
              type: 'warning',
              status: 'unread',
              related_entity_id: doc.id,
              related_entity_type: 'document',
              user_id: doc.user_id,
            });
          if (insertError) console.error('Error inserting document notification:', insertError);
        }
      }
    }

    return new Response(JSON.stringify({ message: 'Alerts checked successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in check-alerts function:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});