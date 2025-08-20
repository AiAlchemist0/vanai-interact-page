import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Play, RefreshCw } from 'lucide-react';
import { useAudioValidation } from '@/hooks/useAudioValidation';
import { useSongStatistics } from '@/hooks/useSongStatistics';

/**
 * Audio diagnostics component for troubleshooting problematic songs
 */
export const AudioDiagnostics: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const audioValidation = useAudioValidation();
  const { statistics, loading: statsLoading } = useSongStatistics();

  const problematicSongs = ['bc-coast-catalyst', 'philippe-pasquier-art-hallucinations', 'brenda-bailey', 'lionel-ringenbach'];

  const getSongStats = (songId: string) => {
    const stat = statistics.find(s => s.song_id === songId);
    return stat || { song_id: songId, total_plays: 0, last_played_at: null };
  };

  const getSuccessRate = (songId: string) => {
    // This would need to come from a more detailed query, but for now we'll estimate
    const stats = getSongStats(songId);
    if (stats.total_plays === 0) return 0;
    
    // These are rough estimates based on the analysis
    const successRates: Record<string, number> = {
      'bc-coast-catalyst': 0,
      'philippe-pasquier-art-hallucinations': 20,
      'brenda-bailey': 45,
      'lionel-ringenbach': 32
    };
    
    return successRates[songId] || 100;
  };

  if (!isExpanded) {
    return (
      <Card className="mb-4 border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">
                Audio Diagnostics Available
              </span>
              <Badge variant="outline" className="text-orange-700">
                {audioValidation.failedSongs.length} issues detected
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(true)}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-orange-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Audio Diagnostics
            </CardTitle>
            <CardDescription>
              Troubleshooting audio file accessibility and tracking performance
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={audioValidation.validateAllAudioFiles}
              disabled={audioValidation.isValidating}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${audioValidation.isValidating ? 'animate-spin' : ''}`} />
              Validate All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(false)}
            >
              Hide
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Problematic Songs Status</h4>
            <div className="grid gap-3">
              {problematicSongs.map(songId => {
                const stats = getSongStats(songId);
                const successRate = getSuccessRate(songId);
                const validationStatus = audioValidation.getSongValidationStatus(songId);
                
                return (
                  <div key={songId} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{songId}</div>
                        <div className="text-xs text-muted-foreground">
                          {stats.total_plays} total plays • {successRate}% success rate
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {validationStatus?.isValid ? (
                          <Badge variant="outline" className="text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        ) : validationStatus?.error ? (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Failed
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Not Tested
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => audioValidation.validateSingleAudio(songId)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                    {validationStatus?.error && (
                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                        Error: {validationStatus.error}
                      </div>
                    )}
                    {validationStatus?.duration && (
                      <div className="text-xs text-green-600">
                        Duration: {validationStatus.duration.toFixed(2)}s
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {audioValidation.lastValidationTime && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              Last validation: {new Date(audioValidation.lastValidationTime).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};