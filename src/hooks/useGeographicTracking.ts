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

  const consolidateDuplicateRecords = async (locationData: GeographicData) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Find all records for this location today
      const { data: duplicates, error: fetchError } = await supabase
        .from('geographic_data')
        .select('*')
        .eq('region', locationData.region)
        .eq('city', locationData.city)
        .gte('last_activity', `${today}T00:00:00.000Z`)
        .order('last_activity', { ascending: false });

      if (fetchError || !duplicates || duplicates.length <= 1) {
        return; // No duplicates or error
      }

      console.log(`🔧 Found ${duplicates.length} duplicate records for ${locationData.city}, ${locationData.region}. Consolidating...`);

      // Calculate total listening count and get most recent activity
      const totalListeningCount = duplicates.reduce((sum, record) => sum + (record.listening_count || 1), 0);
      const mostRecentActivity = duplicates[0].last_activity;
      const primaryRecord = duplicates[0];

      // Update the most recent record with consolidated data
      const { error: updateError } = await supabase
        .from('geographic_data')
        .update({
          listening_count: totalListeningCount,
          last_activity: mostRecentActivity
        })
        .eq('id', primaryRecord.id);

      if (updateError) {
        console.error('Error updating consolidated record:', updateError);
        return;
      }

      // Delete the duplicate records (keep only the first one)
      if (duplicates.length > 1) {
        const duplicateIds = duplicates.slice(1).map(record => record.id);
        const { error: deleteError } = await supabase
          .from('geographic_data')
          .delete()
          .in('id', duplicateIds);

        if (deleteError) {
          console.error('Error deleting duplicate records:', deleteError);
        } else {
          console.log(`✅ Successfully consolidated ${duplicates.length} records into 1 for ${locationData.city}, ${locationData.region}`);
        }
      }
    } catch (error) {
      console.error('Error consolidating duplicate records:', error);
    }
  };

  const recordListeningActivity = async () => {
    try {
      const locationData = await detectLocation();
      if (!locationData) return;

      // First, try to consolidate any duplicate records
      await consolidateDuplicateRecords(locationData);

      // Check if there's already a record for this location today
      const today = new Date().toISOString().split('T')[0];
      
      const { data: existing, error: fetchError } = await supabase
        .from('geographic_data')
        .select('*')
        .eq('region', locationData.region)
        .eq('city', locationData.city)
        .gte('last_activity', `${today}T00:00:00.000Z`)
        .order('last_activity', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('❌ Error checking existing geographic data:', fetchError);
        return;
      }

      if (existing && existing.length > 0) {
        const record = existing[0];
        // Update existing record
        const { error: updateError } = await supabase
          .from('geographic_data')
          .update({
            listening_count: (record.listening_count || 1) + 1,
            last_activity: new Date().toISOString()
          })
          .eq('id', record.id);

        if (updateError) {
          console.error('❌ Error updating geographic data:', updateError);
        } else {
          console.log(`📍 Updated geographic data for ${locationData.city}, ${locationData.region} - Count: ${(record.listening_count || 1) + 1}`);
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
          console.error('❌ Error inserting geographic data:', insertError);
        } else {
          console.log(`📍 Created new geographic data record for ${locationData.city}, ${locationData.region}`);
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