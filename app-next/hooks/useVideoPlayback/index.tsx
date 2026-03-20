import { type VideoPlayer } from 'expo-video';
import { createContext, useContext, useRef, useCallback } from 'react';

interface VideoPlaybackContextType {
  activePlayer: VideoPlayer | null;
  setActivePlayer: (player: VideoPlayer) => void;
  clearActivePlayer: () => void;
  pauseAllPlayers: () => void;
}

const VideoPlaybackContext = createContext<VideoPlaybackContextType | undefined>(undefined);

export function VideoPlaybackProvider({ children }: { children: React.ReactNode }) {
  const activePlayerRef = useRef<VideoPlayer | null>(null);

  const setActivePlayer = useCallback((player: VideoPlayer) => {
    // 暂停之前的播放器
    if (activePlayerRef.current && activePlayerRef.current !== player) {
      try {
        activePlayerRef.current.pause();
      } catch (error) {
        console.warn('Error pausing previous player:', error);
      }
    }

    activePlayerRef.current = player;
  }, []);

  const clearActivePlayer = useCallback(() => {
    activePlayerRef.current = null;
  }, []);

  const pauseAllPlayers = useCallback(() => {
    if (activePlayerRef.current) {
      try {
        activePlayerRef.current.pause();
      } catch (error) {
        console.warn('Error pausing active player:', error);
      }
    }
    activePlayerRef.current = null;
  }, []);

  return (
    <VideoPlaybackContext.Provider
      value={{
        activePlayer: activePlayerRef.current,
        setActivePlayer,
        clearActivePlayer,
        pauseAllPlayers,
      }}>
      {children}
    </VideoPlaybackContext.Provider>
  );
}

export function useVideoPlayback() {
  const context = useContext(VideoPlaybackContext);
  if (context === undefined) {
    throw new Error('useVideoPlayback must be used within a VideoPlaybackProvider');
  }
  return context;
}
