import styles from './AnswerGrid.module.css';

const AnswerGrid = ({ 
  options, 
  selectedAnswer, 
  correctAnswer, 
  gameState, 
  onOptionSelect 
}) => {
  return (
    <div className={styles.grid}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onOptionSelect(option)}
          disabled={gameState === 'showing_result'}
          className={`
            ${styles.option}
            ${gameState === 'showing_result' && option === correctAnswer ? styles.correct : ''}
            ${gameState === 'showing_result' && option === selectedAnswer && option !== correctAnswer ? styles.incorrect : ''}
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default AnswerGrid;
