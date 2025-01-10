import React, { useState } from 'react';
import { Trophy, RefreshCw, Repeat } from 'lucide-react';
import type { Question } from '../types/quiz';

interface Props {
  questions: Question[];
  userAnswers: string[];
  onRestart: () => void;
  onReassess: () => void; // New prop for reassessing the quiz
  isHistoryView?: boolean; // Optional
}

export default function QuizResults({
  questions,
  userAnswers,
  onRestart,
  onReassess,
  isHistoryView = false, // Defaulting to false if not provided
}: Props) {
  const score = questions.reduce(
    (acc, q, idx) => (q.correctAnswer === userAnswers[idx] ? acc + 1 : acc),
    0
  );

  const percentage = Math.round((score / questions.length) * 100);

  const [showAnswers, setShowAnswers] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const [showExplanations, setShowExplanations] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );

  const toggleAnswer = (index: number) => {
    const updated = [...showAnswers];
    updated[index] = !updated[index];
    setShowAnswers(updated);
  };

  const toggleExplanation = (index: number) => {
    const updated = [...showExplanations];
    updated[index] = !updated[index];
    setShowExplanations(updated);
  };

  return (
    <div className="max-w-2xl w-full bg-black text-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-6">
        <Trophy className="w-12 h-12 text-yellow-500" />
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">
        {isHistoryView ? 'Quiz Results' : 'Quiz Complete!'}
      </h2>

      <div className="text-center mb-8">
        <p className="text-4xl font-bold text-indigo-600">{percentage}%</p>
        <p className="text-gray-400">
          You got {score} out of {questions.length} questions correct
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg ${
              q.correctAnswer === userAnswers[idx] ? 'bg-green-700' : 'bg-red-700'
            }`}
          >
            <p className="font-medium mb-2">{q.question}</p>
            <p className="text-sm mb-4">
              <span className="font-medium">Your answer:</span> {userAnswers[idx]}
            </p>

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => toggleAnswer(idx)}
                className={`inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-md border focus:outline-none focus:ring-2 transition-colors duration-300 ${
                  showAnswers[idx]
                    ? 'text-gray-700 bg-gray-300 border-gray-400 hover:bg-gray-400 focus:ring-gray-500'
                    : 'text-indigo-700 bg-indigo-200 border-indigo-400 hover:bg-indigo-300 focus:ring-indigo-500'
                }`}
              >
                {showAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
              </button>

              <button
                onClick={() => toggleExplanation(idx)}
                className={`inline-flex items-center gap-2 py-2 px-4 text-sm font-semibold rounded-md border focus:outline-none focus:ring-2 transition-colors duration-300 ${
                  showExplanations[idx]
                    ? 'text-gray-700 bg-gray-300 border-gray-400 hover:bg-gray-400 focus:ring-gray-500'
                    : 'text-blue-700 bg-blue-200 border-blue-400 hover:bg-blue-300 focus:ring-blue-500'
                }`}
              >
                {showExplanations[idx] ? 'Hide Explanation' : 'Show Explanation'}
              </button>
            </div>

            {showAnswers[idx] && (
              <p className="text-sm mt-2">
                <span className="font-medium">Correct answer:</span> {q.correctAnswer}
              </p>
            )}

            {showExplanations[idx] && q.explanation && (
              <p className="text-sm text-white-400 mt-2">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-8">
        <button
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <RefreshCw className="w-4 h-4" />
          {isHistoryView ? 'Back to History' : 'Try Another Quiz'}
        </button>
        <button
          onClick={onReassess}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Repeat className="w-4 h-4" />
          Reassess Test
        </button>
      </div>
    </div>
  );
}
