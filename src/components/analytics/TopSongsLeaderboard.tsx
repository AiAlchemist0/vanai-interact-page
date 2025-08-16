import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Play, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SongStats {
  song_id: string;
  total_plays: number;
  last_played_at: string;
}

const TopSongsLeaderboard = () => {
  const [songs, setSongs] = useState<SongStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Song metadata mapping
  const songMetadata: Record<string, { title: string; artist: string; genre: string; color: string }> = {
    'bc-ai-hackathon': { 
      title: 'BC AI Hackathon', 
      artist: 'Rival Tech', 
      genre: 'Tech',
      color: 'from-blue-500 to-cyan-500'
    },
    'deepfakes-rain': { 
      title: 'Deepfakes in the Rain', 
      artist: 'KK', 
      genre: 'Electronic',
      color: 'from-purple-500 to-pink-500'
    },
    'dr-patrick': { 
      title: 'Dr. Patrick Parra', 
      artist: 'Pennefather', 
      genre: 'Spoken Word',
      color: 'from-green-500 to-teal-500'
    },
    'hr-macmillan': { 
      title: 'H.R MacMillan Space Centre', 
      artist: 'Alien Abduction', 
      genre: 'Ambient',
      color: 'from-orange-500 to-red-500'
    },
    'mac-consciousness': { 
      title: 'Mind, AI & Consciousness', 
      artist: 'MAC', 
      genre: 'Philosophy',
      color: 'from-indigo-500 to-purple-500'
    },
    'pixel-wizard': { 
      title: 'Mr Pixel Wizard', 
      artist: 'BC AI', 
      genre: 'Digital',
      color: 'from-yellow-500 to-orange-500'
    }
  };

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        const { data, error } = await supabase.rpc('get_song_statistics');
        if (error) throw error;
        setSongs(data || []);
      } catch (error) {
        console.error('Error fetching top songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSongs();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTopSongs, 30000);
    return () => clearInterval(interval);
  }, []);

  const maxPlays = Math.max(...songs.map(song => song.total_plays));

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
      <CardHeader className="border-b border-purple-500/20">
        <CardTitle className="flex items-center space-x-2 text-purple-300">
          <Trophy className="h-5 w-5 text-yellow-400" />
          <span>Top Songs Leaderboard</span>
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10 ml-auto">
            Live Rankings
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {songs.slice(0, 10).map((song, index) => {
            const metadata = songMetadata[song.song_id] || {
              title: song.song_id,
              artist: 'Unknown Artist',
              genre: 'Unknown',
              color: 'from-gray-500 to-gray-600'
            };
            
            const progressPercentage = (song.total_plays / maxPlays) * 100;
            const isTop3 = index < 3;
            
            return (
              <div 
                key={song.song_id}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                  isTop3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' : 'bg-slate-800/30 hover:bg-slate-800/50'
                }`}
              >
                {/* Rank */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-black' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {index + 1}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white truncate">{metadata.title}</h4>
                    <Badge variant="outline" className="text-xs border-purple-500/50 text-purple-300">
                      {metadata.genre}
                    </Badge>
                    {isTop3 && <Trophy className="h-3 w-3 text-yellow-400" />}
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{metadata.artist}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Plays</span>
                      <span className="text-cyan-400 font-medium">{song.total_plays}</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={progressPercentage} 
                        className="h-2 bg-slate-800"
                      />
                      <div 
                        className={`absolute inset-0 h-2 rounded-full bg-gradient-to-r ${metadata.color} opacity-80`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex-shrink-0 text-right space-y-1">
                  <div className="flex items-center text-xs text-slate-400">
                    <Play className="h-3 w-3 mr-1" />
                    {song.total_plays}
                  </div>
                  <div className="flex items-center text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(song.last_played_at).toLocaleDateString()}
                  </div>
                  {index < 3 && (
                    <div className="flex items-center text-xs text-green-400">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSongsLeaderboard;