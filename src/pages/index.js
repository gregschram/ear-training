import React, { useState } from 'react';
import { categories } from '../data/categories';
import { groceryExercises } from '../data/exercises/grocery';

const EXERCISES = {
  SPOKEN_SENTENCE: {
    id: 'spoken-sentence',
    title: 'Identify the spoken sentence',
    description: 'Hear an everyday sentence, answer from written multiple choice'
  }
  // We'll add other exercise types later
};

// Generate 10 random rounds for an exercise
const generateExerciseRounds = (category, exerciseType, count = 10) => {
  let sourceData;
  switch (category) {
    case 'grocery':
      sourceData = groceryExercises;
      break;
    default:
      return [];
  }

  const items = sourceData.sentences.items;
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const HomePage = ({ onSelectExercise }) => {
  return (
    <div className="grid gap-6 p-6">
      {Object.values(EXERCISES).map((exercise) => (
        <button
          key={exercise.id}
          onClick={() => onSelectExercise(exercise.id)}
          className="p-4 border rounded hover:bg-gray-50"
        >
          <h2 className="text-xl font-bold">{exercise.title}</h2>
          <p>{exercise.description}</p>
        </button>
      ))}
    </div>
  );
};

const ExerciseGame = ({ exerciseType, category, rounds, onHome }) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [gameState, setGameState] = useState('playing');
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = React.useRef(null);

  const currentRound = rounds[currentRoundIndex];

const playAudio = (speed = playbackSpeed) => {
  if (audioRef.current) {
    console.log('Attempting to play:', currentRound.audioPath);
    debugAudio(currentRound.audioPath);
    
    audioRef.current.playbackRate = speed;
    audioRef.current.currentTime = 0;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => console.log('Audio started playing'))
        .catch(error => console.error('Audio play error:', error));
    }
  }
};

const debugAudio = async (audioPath) => {
  try {
    const response = await fetch(audioPath);
    console.log('Audio fetch response:', response.status, response.statusText);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Audio file accessible');
  } catch (error) {
    console.error('Audio fetch error:', error);
  }
};

const togglePlaybackSpeed = () => {
  const newSpeed = playbackSpeed === 1 ? 0.5 : 1;
  setPlaybackSpeed(newSpeed);
  if (audioRef.current) {
    audioRef.current.playbackRate = newSpeed;
  }
};
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onHome} className="mb-4">← Back to Exercises</button>
        <h2 className="text-xl font-bold mb-4">{category}</h2>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-right mb-4">
            Score: {score}/{totalAttempts}
          </div>

          <div className="mb-6">
            <audio ref={audioRef} src={currentRound.audioPath} />
            <button 
              onClick={() => playAudio()}
              className="w-full p-4 bg-blue-500 text-white rounded mb-2"
            >
              Play Sound {playbackSpeed !== 1 ? '(Slow)' : ''}
            </button>
            <button
              onClick={togglePlaybackSpeed}
              className="w-full p-4 border rounded"
            >
              {playbackSpeed === 1 ? 'Switch to Slow Speed' : 'Switch to Normal Speed'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentRound.options.map((option) => (
              <button
                key={option}
                onClick={() => {/* handle option click */}}
                className="p-4 border rounded h-16"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleExerciseSelect = (exerciseId) => {
    setSelectedExercise(exerciseId);
    setCurrentView('exercise');
  };

  const handleHome = () => {
    setCurrentView('home');
    setSelectedExercise(null);
  };

  if (currentView === 'home') {
    return <HomePage onSelectExercise={handleExerciseSelect} />;
  }

  const rounds = generateExerciseRounds('grocery', selectedExercise);

  return (
    <ExerciseGame
      exerciseType={selectedExercise}
      category="Grocery"
      rounds={rounds}
      onHome={handleHome}
    />
  );
};

export default App;
