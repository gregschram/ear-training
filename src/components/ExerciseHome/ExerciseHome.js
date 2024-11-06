import { useState } from 'react';
import styles from './ExerciseHome.module.css';

const EXERCISES = {
  SPOKEN_SENTENCE: {
    id: 'SPOKEN_SENTENCE',
    title: 'Identify the spoken sentence',
    description: 'Hear an everyday sentence, answer from written multiple choice',
    category: 'grocery'
  }
};

const ExerciseHome = ({ onSelectExercise }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hearing Training Exercises</h1>
        <div className={styles.exerciseGrid}>
          {Object.values(EXERCISES).map((exercise) => (
            <button
              key={exercise.id}
              className={styles.exerciseCard}
              onClick={() => onSelectExercise(exercise.id)}
            >
              <h2 className={styles.exerciseTitle}>{exercise.title}</h2>
              <p className={styles.exerciseDescription}>
                {exercise.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseHome;
