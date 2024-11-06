import { useState } from 'react';
import ExerciseHome from '../components/ExerciseHome/ExerciseHome';
import ExerciseGame from '../components/ExerciseGame/ExerciseGame';
import { groceryExercises } from '../data/exercises/grocery';

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function Home() {
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
    return <ExerciseHome onSelectExercise={handleExerciseSelect} />;
  }

  // Get 10 random rounds from the exercise data
  const rounds = shuffleArray(groceryExercises.sentences.items).slice(0, 10);

  return (
    <ExerciseGame
      rounds={rounds}
      category="Grocery"
      onHome={handleHome}
    />
  );
}
