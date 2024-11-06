import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PlayCircle, FastForward, Rewind, Home } from 'lucide-react';

const EXERCISES = {
  SPOKEN_SENTENCE: {
    id: 'spoken-sentence',
    title: 'Identify the spoken sentence',
    description: 'Hear an everyday sentence, answer from written multiple choice'
  }
};

const HomePage = ({ onSelectExercise }) => {
  return (
    <div className="grid gap-6 p-6">
      {Object.values(EXERCISES).map((exercise) => (
        <Card 
          key={exercise.id} 
          className="hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => onSelectExercise(exercise.id)}
        >
          <CardHeader>
            <CardTitle>{exercise.title}</CardTitle>
            <CardDescription>{exercise.description}</CardDescription>
          </CardHeader>
        </Card>
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
  const audioRef = useRef(null);

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
      
      if (option === currentRound.correctAnswer) {
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
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Navigation Header */}
      <div className="max-w-2xl mx-auto mb-4 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onHome}
          className="flex items-center gap-2 hover:bg-gray-200"
        >
          <Home className="h-4 w-4" />
          Back to Exercises
        </Button>
        <h2 className="text-xl font-bold">{category}</h2>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          {/* Score Display */}
          <div className="mb-6 text-right">
            <span className="text-lg font-semibold">
              Score: {score}/{totalAttempts}
            </span>
          </div>

          {/* Audio Controls */}
          <div className="mb-6 space-y-4">
            <audio ref={audioRef} src={currentRound.audioPath} />
            
            <Button 
              onClick={() => playAudio()}
              className="w-full hover:bg-blue-600"
              size="lg"
            >
              <PlayCircle className="mr-2 h-6 w-6" />
              Play Sound {playbackSpeed !== 1 ? '(Slow)' : ''}
            </Button>

            <Button
              onClick={togglePlaybackSpeed}
              variant={playbackSpeed === 1 ? "outline" : "secondary"}
              className="w-full hover:bg-gray-100"
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
            </Button>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {currentRound.options.map((option) => (
              <Button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={gameState === 'showing_result'}
                className={`
                  h-16 text-lg cursor-pointer hover:bg-blue-50
                  ${gameState === 'showing_result' && option === currentRound.correctAnswer ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                  ${gameState === 'showing_result' && option === selectedAnswer && option !== currentRound.correctAnswer ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                `}
              >
                {option}
              </Button>
            ))}
          </div>

          {/* Result Alert */}
          {gameState === 'showing_result' && (
            <Alert className={`mb-6 ${selectedAnswer === currentRound.correctAnswer ? 'bg-green-50' : 'bg-red-50'}`}>
              <AlertDescription>
                {selectedAnswer === currentRound.correctAnswer
                  ? "Correct! Well done!"
                  : `Incorrect. The correct answer was "${currentRound.correctAnswer}". Listen again!`}
              </AlertDescription>
            </Alert>
          )}

          {/* Next Button */}
          {gameState === 'showing_result' && (
            <Button 
              onClick={handleNext}
              className="w-full hover:bg-blue-600"
              size="lg"
            >
              Next
            </Button>
          )}
        </CardContent>
      </Card>
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

  const generateExerciseRounds = (category, exerciseType, count = 10) => {
    const rounds = groceryExercises.sentences.items;
    return [...rounds].sort(() => Math.random() - 0.5).slice(0, count);
  };

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
