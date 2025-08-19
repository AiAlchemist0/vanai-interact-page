import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { locationManager, type GeographicData } from '@/utils/locationManager';

export const useGeographicTracking = () => {
  const [location, setLocation] = useState<GeographicData | null>(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = async () => {
    if (location) return location; // Already detected
    
    setLoading(true);
    
    try {
      const locationData = await locationManager.getLocation();
      setLocation(locationData);
      return locationData;
    } catch (error) {
      console.error('Error in detectLocation:', error);
      
      // Emergency fallback
      const emergencyLocation = {
        region: 'BC',
        city: 'Vancouver',
        country: 'Canada'
      };
      
      setLocation(emergencyLocation);
      return emergencyLocation;
    } finally {
      setLoading(false);
    }
  };

  const recordListeningActivity = async () => {
    try {
      const locationData = await detectLocation();
      if (!locationData) return;

      // Check if there's already a record for this location today
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existing, error: fetchError } = await supabase
        .from('geographic_data')
        .select('*')
        .eq('region', locationData.region)
        .eq('city', locationData.city)
        .gte('last_activity', `${today}T00:00:00.000Z`)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking existing geographic data:', fetchError);
        return;
      }

      if (existing) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('geographic_data')
          .update({
            listening_count: existing.listening_count + 1,
            last_activity: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (updateError) {
          console.error('Error updating geographic data:', updateError);
        }
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('geographic_data')
          .insert({
            region: locationData.region,
            city: locationData.city,
            listening_count: 1,
            last_activity: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error inserting geographic data:', insertError);
        }
      }
    } catch (error) {
      console.error('Failed to record geographic activity:', error);
    }
  };

  // No automatic location detection on mount to prevent API storms
  // Location is detected only when needed via detectLocation() or recordListeningActivity()

  return {
    location,
    loading,
    detectLocation,
    recordListeningActivity
  };
};