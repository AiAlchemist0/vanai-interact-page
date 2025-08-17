import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Play, Clock, TrendingUp, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getSongMetadata } from "@/utils/songData";
import { useAudio } from "@/contexts/AudioContext";

interface SongStats {
  song_id: string;
  total_plays: number;
  last_played_at: string;
}

const TopSongsLeaderboard = () => {
  const [songs, setSongs] = useState<SongStats[]>([]);
  const [loading, setLoading] = useState(true);
  const { loadSpecificSong, startPlayback, currentSong, isPlaying } = useAudio();

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

  const handlePlaySong = (songId: string) => {
    loadSpecificSong(songId);
    startPlayback();
  };

  if (loading) {
    return (
      <Card className="bg-slate-900/50 border-purple-500/30 shadow-2xl shadow-purple-500/10 backdrop-blur-xl">
        <CardHeader className="border-b border-purple-500/20">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2 w-full" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
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
            const metadata = getSongMetadata(song.song_id);
            const progressPercentage = (song.total_plays / maxPlays) * 100;
            const isTop3 = index < 3;
            const isCurrentlyPlaying = currentSong?.id === song.song_id && isPlaying;
            
            return (
              <div 
                key={song.song_id}
                className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  isCurrentlyPlaying 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 shadow-lg shadow-blue-500/20' 
                    : isTop3 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' 
                      : 'bg-slate-800/30 hover:bg-slate-800/50'
                }`}
                onClick={() => handlePlaySong(song.song_id)}
              >
                {/* Rank Badge */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-black' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {index + 1}
                </div>

                {/* Cover Art */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-700">
                    <img 
                      src={metadata.coverArt} 
                      alt={`${metadata.title} cover`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  {isCurrentlyPlaying && (
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>

                {/* Song Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-white truncate text-sm">{metadata.title}</h4>
                    {isTop3 && <Trophy className="h-3 w-3 text-yellow-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 mb-2 truncate">{metadata.artist}</p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Plays</span>
                      <span className="text-cyan-400 font-medium">{song.total_plays}</span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={progressPercentage} 
                        className="h-1.5 bg-slate-800"
                      />
                      <div 
                        className={`absolute inset-0 h-1.5 rounded-full bg-gradient-to-r ${metadata.color} opacity-80`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Play Button & Stats */}
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(song.song_id);
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCurrentlyPlaying 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 group-hover:scale-110'
                    }`}
                  >
                    {isCurrentlyPlaying ? (
                      <Music className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </button>
                  
                  <div className="text-center space-y-0.5">
                    <div className="text-xs text-slate-500">
                      {new Date(song.last_played_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    {index < 3 && (
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                        Hot
                      </div>
                    )}
                  </div>
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