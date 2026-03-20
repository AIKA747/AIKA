import type { useVideoPlayer, VideoPlayer } from 'expo-video';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface VideoContextType {
  currentPlayingId: number | null;
  registerPlayer: (id: number, player: VideoPlayer) => void;
  unregisterPlayer: (id: number) => void;
  play: (id: number) => void;
  pause: (id: number) => void;
  replay: (id: number) => void;
  stopAllPlayers: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentPlayingId = useRef<number | null>(null);
  const [players, setPlayers] = useState<Map<number, ReturnType<typeof useVideoPlayer>>>(new Map());

  const registerPlayer = useCallback((id: number, player: VideoPlayer) => {
    // setPlayers((v) => Object.assign(v, { [id]: player }));
    setPlayers((v) => v.set(id, player));
  }, []);

  const unregisterPlayer = useCallback((id: number) => {
    setPlayers((v) => {
      const p = v.get(id);
      if (p) {
        p.pause();
        v.delete(id);
      }
      return v;
    });
  }, []);

  const stopAllPlayers = useCallback(() => {
    console.log('players:', players);
    // players?.forEach((p) => {
    //   p.pause?.();
    // });
  }, [players]);

  const play = useCallback(
    (id: number) => {
      if (currentPlayingId && currentPlayingId.current !== id) {
        console.log('players;', players);
        players.forEach((p) => {
          p?.pause();
        });
      }
      players.get(id)?.play();
      currentPlayingId.current = id;
    },
    [players],
  );

  const replay = useCallback(
    (id: number) => {
      if (players.has(id)) {
        players.get(id)?.replay();
        if (currentPlayingId.current === id) {
          currentPlayingId.current = null;
        }
      }
    },
    [currentPlayingId, players],
  );

  const pause = useCallback(
    (id: number) => {
      if (players.has(id)) {
        players.get(id)?.pause();
        if (currentPlayingId.current === id) {
          currentPlayingId.current = null;
        }
      }
    },
    [players],
  );

  return (
    <VideoContext.Provider
      value={{
        currentPlayingId: currentPlayingId.current,
        registerPlayer,
        unregisterPlayer,
        stopAllPlayers,
        play,
        pause,
        replay,
      }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideoProvider = (): VideoContextType => {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideoContext must be used within VideoProvider');
  return ctx;
};

export default VideoProvider;
