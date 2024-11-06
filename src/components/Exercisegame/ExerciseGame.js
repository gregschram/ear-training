import { useState, useRef } from 'react';
import { Home } from 'lucide-react';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import AnswerGrid from './components/AnswerGrid/AnswerGrid';
import styles from './ExerciseGame.module.css';

const ExerciseGame = ({ rounds, category, onHome }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef(null);

  const currentRound = rounds[currentRoundIndex];

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleSpeedToggle = () => {
    const newSpeed = playbackSpeed === 1 ? 0.65 : 1;
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleOptionSelect = (option) => {
    if (gameState === 'playing') {
      setSelectedAnswer(option);
      setGameState('showing_result');
      setTotalAttempts(totalAttempts + 1);
      
      if (option === currentRound.sentence) {
        setScore(score + 1);
      } else {
        setTimeout(playAudio, 1000);
      }
    }
  };

  const handleNext = () => {
    if (currentRoundIndex < rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1);
      setGameState('playing');
      setSelectedAnswer(null);
    } else {
      alert(`Exercise complete! Final score: ${score}/${totalAttempts}`);
      onHome();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <button onClick={onHome} className={styles.backButton}>
            <Home className={styles.icon} />
            Back to Exercises
          </button>
          <div className={styles.headerRight}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <div className={styles.score}>
              Score: {score}/{totalAttempts}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <audio ref={audioRef} src={currentRound.audioPath} />
          
          <AudioPlayer
            audioRef={audioRef}
            playbackSpeed={playbackSpeed}
            onPlay={playAudio}
            onSpeedToggle={handleSpeedToggle}
          />

          <AnswerGrid
            options={currentRound.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentRound.sentence}
            gameState={gameState}
            onOptionSelect={handleOptionSelect}
          />

          {gameState === 'showing_result' && (
            <>
              <div className={`${styles.feedback} ${selectedAnswer === currentRound.sentence ? styles.correct : styles.incorrect}`}>
                {selectedAnswer === currentRound.sentence
                  ? "Correct! Well done!"
                  : `Incorrect. The correct answer was "${currentRound.sentence}". Listen again!`}
              </div>

              <button onClick={handleNext} className={styles.nextButton}>
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseGame;
