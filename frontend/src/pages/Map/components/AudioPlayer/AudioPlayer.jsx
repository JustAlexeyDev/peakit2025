// src/pages/Map/components/AudioPlayer.jsx
import React, { useState } from 'react';
import { AudioService } from '../../../../modules/services/audio.service';
import './AudioPlayer.css';

const AudioPlayer = ({ currentAudio, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      AudioService.pauseAudio();
    } else {
      AudioService.playAudio(currentAudio?.audioId);
    }
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    AudioService.stopAudio();
    onClose();
  };

  if (!currentAudio) return null;

  return (
    <div className="audio-player">
      <div className="audio-player__content">
        <h3 className="audio-player__title">{currentAudio.name}</h3>
        <div className="audio-player__controls">
          <button 
            className="audio-player__btn audio-player__btn--play"
            onClick={handlePlayPause}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button 
            className="audio-player__btn audio-player__btn--close"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;