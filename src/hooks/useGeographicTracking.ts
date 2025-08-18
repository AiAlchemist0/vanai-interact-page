import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GeographicData {
  region: string;
  city: string;
  country: string;
}

export const useGeographicTracking = () => {
  const [location, setLocation] = useState<GeographicData | null>(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = async () => {
    if (location) return location; // Already detected
    
    setLoading(true);
    try {
      // Try to get location from IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.region && data.city) {
        const locationData = {
          region: data.region_code || data.region || 'Unknown',
          city: data.city || 'Unknown',
          country: data.country_name || 'Unknown'
        };
        
        setLocation(locationData);
        
        // Store in localStorage for future use
        localStorage.setItem('user_location', JSON.stringify(locationData));
        return locationData;
      } else {
        // Fallback to stored location or default
        const stored = localStorage.getItem('user_location');
        if (stored) {
          const parsedLocation = JSON.parse(stored);
          setLocation(parsedLocation);
          return parsedLocation;
        } else {
          // Default to BC, Canada for this BC AI app
          const defaultLocation = {
            region: 'BC',
            city: 'Vancouver',
            country: 'Canada'
          };
          setLocation(defaultLocation);
          return defaultLocation;
        }
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      
      // Fallback to stored location or default
      const stored = localStorage.getItem('user_location');
      if (stored) {
        const parsedLocation = JSON.parse(stored);
        setLocation(parsedLocation);
        return parsedLocation;
      } else {
        // Default to BC, Canada
        const defaultLocation = {
          region: 'BC',
          city: 'Vancouver',
          country: 'Canada'
        };
        setLocation(defaultLocation);
        return defaultLocation;
      }
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
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
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

      console.log('Geographic activity recorded:', locationData);
    } catch (error) {
      console.error('Failed to record geographic activity:', error);
    }
  };

  // Auto-detect location on hook initialization
  useEffect(() => {
    detectLocation();
  }, []);

  return {
    location,
    loading,
    detectLocation,
    recordListeningActivity
  };
};