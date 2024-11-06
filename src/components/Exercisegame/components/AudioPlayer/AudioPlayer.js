import { PlayCircle, Rewind, FastForward } from 'lucide-react';
import styles from './AudioPlayer.module.css';

const AudioPlayer = ({ audioRef, playbackSpeed, onPlay, onSpeedToggle }) => {
  return (
    <div className={styles.container}>
      <button 
        onClick={onPlay}
        className={styles.playButton}
      >
        <PlayCircle className={styles.icon} />
        Play Sound {playbackSpeed !== 1 ? '(Slow)' : ''}
      </button>

      <button
        onClick={onSpeedToggle}
        className={styles.speedButton}
      >
        {playbackSpeed === 1 ? (
          <>
            <Rewind className={styles.icon} />
            Switch to Slow Speed
          </>
        ) : (
          <>
            <FastForward className={styles.icon} />
            Switch to Normal Speed
          </>
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
