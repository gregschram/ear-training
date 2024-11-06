import React, { useState, useRef } from 'react';
import { PlayCircle, Rewind, FastForward, Home } from 'lucide-react';
import { groceryExercises } from '../data/exercises/grocery';

const EXERCISES = {
  SPOKEN_SENTENCE: {
    id: 'SPOKEN_SENTENCE',  // Changed to match the key
    title: 'Identify the spoken sentence',
    description: 'Hear an everyday sentence, answer from written multiple choice',
    generator: () => {
      // Simplified generator that just returns the items
      return groceryExercises.sentences.items;
    }
  }
};

const HomePage = ({ onSelectExercise }) => {
  return (
    <div className="min-h-screen bg-red-500 p-8">  // This should make the background bright red
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hearing Training Exercises</h1>
        <div className="grid gap-6">
          {Object.values(EXERCISES).map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => onSelectExercise(exercise.id)}
              className="w-full p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
            >
              <h2 className="text-xl font-semibold mb-2">{exercise.title}</h2>
              <p className="text-gray-600">{exercise.description}</p>
            </button>
          ))}
        </div>
      </div>
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
  const audioRef = useRef(null);

  const currentRound = rounds[currentRoundIndex];

  const playAudio = (speed = playbackSpeed) => {
    if (audioRef.current) {
      console.log('Attempting to play:', currentRound.audioPath);
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

  const togglePlaybackSpeed = () => {
    const newSpeed = playbackSpeed === 1 ? 0.65 : 1;
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleOptionClick = (option) => {
    if (gameState === 'playing') {
      setSelectedAnswer(option);
      setGameState('showing_result');
      setTotalAttempts(totalAttempts + 1);
      
      if (option === currentRound.sentence) {  // Changed from correctAnswer to sentence
        setScore(score + 1);
      } else {
        setTimeout(() => playAudio(), 1000);
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onHome}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Exercises
          </button>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{category}</h2>
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="font-semibold">{score}/{totalAttempts}</span>
            </div>
          </div>
        </div>

        {/* Main Game Card */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Audio Controls */}
          <div className="space-y-4 mb-8">
            <audio ref={audioRef} src={currentRound.audioPath} />
            
            <button 
              onClick={() => playAudio()}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
            >
              <PlayCircle className="mr-2 h-6 w-6" />
              Play Sound {playbackSpeed !== 1 ? '(Slow)' : ''}
            </button>

            <button
              onClick={togglePlaybackSpeed}
              className="w-full px-6 py-4 bg-white border rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              {playbackSpeed === 1 ? (
                <>
                  <Rewind className="mr-2 h-4 w-4" />
                  Switch to Slow Speed
                </>
              ) : (
                <>
                  <FastForward className="mr-2 h-4 w-4" />
                  Switch to Normal Speed
                </>
              )}
            </button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {currentRound.options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={gameState === 'showing_result'}
                className={`
                  px-6 py-4 rounded-xl text-lg transition-colors relative
                  ${gameState === 'showing_result' && option === currentRound.sentence 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : gameState === 'showing_result' && option === selectedAnswer 
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'}
                  ${gameState === 'showing_result' ? 'cursor-default' : 'cursor-pointer'}
                  disabled:opacity-50
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Result Alert */}
          {gameState === 'showing_result' && (
            <div className={`mb-6 p-4 rounded-xl ${
              selectedAnswer === currentRound.sentence
                ? 'bg-green-50 border-2 border-green-200' 
                : 'bg-red-50 border-2 border-red-200'
            }`}>
              <p className="text-center text-lg">
                {selectedAnswer === currentRound.sentence
                  ? "Correct! Well done!"
                  : `Incorrect. The correct answer was "${currentRound.sentence}". Listen again!`}
              </p>
            </div>
          )}

          {/* Next Button */}
          {gameState === 'showing_result' && (
            <button 
              onClick={handleNext}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Next
            </button>
          )}
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

  // Get the exercise configuration and generate rounds
  const exercise = EXERCISES[selectedExercise];
  const rounds = exercise.generator();

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
