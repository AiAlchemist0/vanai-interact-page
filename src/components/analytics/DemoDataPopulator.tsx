import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const DemoDataPopulator = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const populateData = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase.functions.invoke('populate-demo-data');
      
      if (error) {
        throw error;
      }

      console.log('Demo data populated:', data);
      setSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      console.error('Failed to populate demo data:', err);
      setError(err instanceof Error ? err.message : 'Failed to populate data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
      <div className="flex items-center gap-3">
        <Database className="h-5 w-5 text-blue-500" />
        <div className="flex-1">
          <h3 className="font-medium text-foreground">Demo Data</h3>
          <p className="text-sm text-muted-foreground">
            Populate sample geographic data, sessions, and metrics for demonstration
          </p>
        </div>
        <Button
          onClick={populateData}
          disabled={loading}
          variant={success ? "default" : "outline"}
          size="sm"
          className="flex-shrink-0"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Success!
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Populate Data
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      )}
    </Card>
  );
};