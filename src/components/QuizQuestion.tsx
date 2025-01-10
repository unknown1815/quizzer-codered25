import React from 'react';
import { Question } from '../types/quiz';

interface Props {
  question: Question;
  onAnswer: (answer: string) => Promise<void>;
  currentQuestion: number;
  totalQuestions: number;
}

export default function QuizQuestion({
  question,
  onAnswer,
  currentQuestion,
  totalQuestions,
}: Props) {
  return (
    <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">{question.question}</h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            className="w-full text-left p-3 rounded-md border border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
