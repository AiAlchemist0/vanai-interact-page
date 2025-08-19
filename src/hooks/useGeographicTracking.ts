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
      // Check localStorage first for cached location (valid for 24 hours)
      const stored = localStorage.getItem('user_location');
      const lastUpdated = localStorage.getItem('location_timestamp');
      
      if (stored && lastUpdated) {
        const timeDiff = Date.now() - parseInt(lastUpdated);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (timeDiff < twentyFourHours) {
          const parsedLocation = JSON.parse(stored);
          setLocation(parsedLocation);
          setLoading(false);
          return parsedLocation;
        }
      }

      // Try to get location from IP geolocation service with better error handling
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
        
        const response = await fetch('https://ipapi.co/json/', {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'BC-AI-App/1.0'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          if (response.status === 429) {
            console.warn('IP geolocation rate limited, using fallback');
          } else {
            console.warn(`IP geolocation failed: ${response.status} ${response.statusText}`);
          }
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          console.warn('IP geolocation API error:', data.reason);
          throw new Error(data.reason || 'API Error');
        }
        
        if (data.region && data.city) {
          const locationData = {
            region: data.region_code || data.region || 'BC',
            city: data.city || 'Vancouver',
            country: data.country_name || 'Canada'
          };
          
          setLocation(locationData);
          localStorage.setItem('user_location', JSON.stringify(locationData));
          localStorage.setItem('location_timestamp', Date.now().toString());
          return locationData;
        }
        
      } catch (fetchError) {
        console.warn('Location detection via IP failed:', fetchError.message);
      }
      
      // Fallback to stored location if available
      if (stored) {
        const parsedLocation = JSON.parse(stored);
        setLocation(parsedLocation);
        return parsedLocation;
      }
      
      // Final fallback to BC, Canada (appropriate for BC AI app)
      const defaultLocation = {
        region: 'BC',
        city: 'Vancouver',
        country: 'Canada'
      };
      
      setLocation(defaultLocation);
      localStorage.setItem('user_location', JSON.stringify(defaultLocation));
      localStorage.setItem('location_timestamp', Date.now().toString());
      return defaultLocation;
      
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