import React, { useState, useEffect, useCallback } from 'react';
import styles from './Quiz.module.css';
import Navbar from '../../components/Navbar/Navbar';

function Quiz() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [quizData, setQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const displayError = (message) => {
    setError(message);
    setShowErrorModal(true);
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setError('');
  };

  const generateQuiz = async () => {
    if (!topic.trim()) {
      displayError("Please enter a topic for the quiz.");
      return;
    }

    setLoading(true);
    setError('');
    setShowErrorModal(false);
    setQuizStarted(false);
    setQuizFinished(false);
    setQuizData([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);

    const prompt = `Generate 10 multiple-choice quiz questions about "${topic}" with a difficulty level of "${difficulty}". Each question should have exactly 4 options, and one correct answer. Provide the output as a JSON array, where each object has 'question', 'options' (an array of strings), and 'correctAnswer' (a string matching one of the options). Ensure all options are unique and the correct answer is always one of the provided options.`;

    try {
      const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                options: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                  minItems: 4,
                  maxItems: 4
                },
                correctAnswer: { type: "STRING" }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        }
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonString = result.candidates[0].content.parts[0].text;
        const parsedQuizData = JSON.parse(jsonString);

        if (!Array.isArray(parsedQuizData) || parsedQuizData.length !== 10) {
          throw new Error("Failed to generate 10 questions. Please try again.");
        }

        setQuizData(parsedQuizData);
        setQuizStarted(true);
      } else {
        throw new Error("Invalid response format from Gemini API. Please try again.");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      displayError(`Failed to generate quiz: ${err.message}. Please try again with a different topic or difficulty.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleSubmitQuiz = useCallback(() => {
    let newScore = 0;
    quizData.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
    setQuizFinished(true);
  }, [quizData, userAnswers]);

  const startNewQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setQuizData([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setScore(0);
    setTopic('');
    setDifficulty('easy');
    setError('');
    setShowErrorModal(false);
    setShowReviewModal(false);
  };

  const ErrorModal = ({ message, onClose }) => (
    <div className={styles.modalOverlay}>
      <div className={styles.errorModalContent}>
        <h3 className={styles.modalTitle}>Error!</h3>
        <p className={styles.modalMessage}>{message}</p>
        <button
          onClick={onClose}
          className={styles.buttonPrimary}
        >
          Close
        </button>
      </div>
    </div>
  );

  const ReviewModal = ({ quizData, userAnswers, onClose }) => (
    <div className={styles.modalOverlay}>
      <div className={styles.reviewModalContent}>
        <h3 className={styles.modalTitle}>Review Your Answers</h3>
        <div className={styles.reviewScroll}>
          {quizData.map((q, index) => (
            <div key={index} className={styles.reviewQuestionItem}>
              <p className={styles.reviewQuestionText}>
                {index + 1}. {q.question}
              </p>
              <p className={styles.reviewAnswerText}>
                Your Answer:{" "}
                <span className={
                  userAnswers[index] === q.correctAnswer
                    ? styles.answerCorrect
                    : styles.answerIncorrect
                }>
                  {userAnswers[index] || 'No Answer'}
                </span>
              </p>
              <p className={styles.reviewAnswerText}>
                Correct Answer:{" "}
                <span className={styles.answerCorrect}>{q.correctAnswer}</span>
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className={styles.buttonPrimary}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.appContainer}>
      <Navbar />
      <h1 className={styles.headerTitle}>
        Skill<span>Storm</span>
      </h1>

      {showErrorModal && <ErrorModal message={error} onClose={closeErrorModal} />}
      {showReviewModal && (
        <ReviewModal
          quizData={quizData}
          userAnswers={userAnswers}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {!quizStarted && !quizFinished && (
        <div className={styles.card}>
          <h2 className={`${styles.textCenter} ${styles.h2Title}`}>Test Your Skill</h2>
          <div className={styles.marginBottom4}>
            <label htmlFor="topic" className={styles.formLabel}>
              Topic:
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={styles.formInput}
              placeholder="Enter a specific topic"
              disabled={loading}
            />
          </div>
          <div className={styles.marginBottom6}>
            <label htmlFor="difficulty" className={styles.formLabel}>
              Difficulty:
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className={styles.formSelect}
              disabled={loading}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button
            onClick={generateQuiz}
            className={styles.buttonPrimary}
            disabled={loading}
          >
            {loading ? 'Generating Quiz...' : 'Start Quiz'}
          </button>
        </div>
      )}

      {quizStarted && !quizFinished && quizData.length > 0 && (
        <div className={`${styles.card} ${styles.quizCard}`}>
          <p className={`${styles.quizStatusText} ${styles.textCenter}`}>
            Question {currentQuestionIndex + 1} of {quizData.length}
          </p>
          <div className={styles.marginBottom6}>
            <h3 className={styles.questionText}>
              {quizData[currentQuestionIndex].question}
            </h3>
            <div className={styles.gridOptions}>
              {quizData[currentQuestionIndex].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`${styles.optionButton} ${userAnswers[currentQuestionIndex] === option ? styles.selected : ''}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.quizNavigation}>
            {currentQuestionIndex < quizData.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                disabled={!userAnswers.hasOwnProperty(currentQuestionIndex)}
                className={`${styles.buttonSecondary} ${!userAnswers.hasOwnProperty(currentQuestionIndex) ? styles.buttonSecondaryDisabled : ''}`}
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={!userAnswers.hasOwnProperty(currentQuestionIndex)}
                className={`${styles.buttonPrimary} ${!userAnswers.hasOwnProperty(currentQuestionIndex) ? styles.buttonPrimaryDisabled : ''}`}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {quizFinished && (
        <div className={`${styles.card} ${styles.quizCard} ${styles.textCenter}`}>
          <h2 className={`${styles.h2Title} ${styles.quizCompletedTitle}`}>Quiz Completed!</h2>
          <p className={styles.resultScoreText}>
            You scored <span className={styles.scoreHighlight}>{score}</span> out of {quizData.length} questions.
          </p>
          <button
            onClick={startNewQuiz}
            className={styles.buttonPrimary}
          >
            Start New Quiz
          </button>
          <button
            onClick={() => setShowReviewModal(true)}
            className={`${styles.buttonSecondary} ${styles.reviewButton}`}
          >
            Review Your Answers
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
