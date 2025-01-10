import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import QuizSetup from "./QuizSetup";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import { generateQuestions } from "../services/groq";
import { supabase } from "../lib/supabase";
import type { Question, QuizConfig } from "../types/quiz";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);

  const LOCAL_STORAGE_KEY = "quiz-progress";

  useEffect(() => {
    const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedProgress) {
      const { questions, currentQuestion, userAnswers, quizConfig } = JSON.parse(savedProgress);
      setQuestions(questions || []);
      setCurrentQuestion(currentQuestion || 0);
      setUserAnswers(userAnswers || []);
      setQuizConfig(quizConfig || null);
    }
  }, []);

  const saveProgress = () => {
    const progress = {
      questions,
      currentQuestion,
      userAnswers,
      quizConfig,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
  };

  const handleStart = async (config: QuizConfig) => {
    setLoading(true);
    setError(null);
    setQuizConfig(config);

    try {
      const generatedQuestions = await generateQuestions(config);
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setUserAnswers([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      setError("Failed to generate questions. Please try again.");
    }
    setLoading(false);
  };

  const handleResume = () => {
    // Placeholder for additional resume logic if needed
  };

  const handleReassess = async () => {
    if (!quizConfig) return;
    setLoading(true);
    setError(null);

    try {
      const reassessQuestions = await generateQuestions(quizConfig);
      setQuestions(reassessQuestions);
      setCurrentQuestion(0);
      setUserAnswers([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      setError("Failed to generate reassess questions. Please try again.");
    }
    setLoading(false);
  };

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...userAnswers, answer];
    setUserAnswers(newAnswers);

    if (currentQuestion === questions.length - 1) {
      const score = newAnswers.reduce(
        (acc, ans, idx) => (questions[idx].correctAnswer === ans ? acc + 1 : acc),
        0
      );

      const { data: { user } } = await supabase.auth.getUser();
      if (user && quizConfig) {
        await supabase.from("quiz_history").insert({
          user_id: user.id,
          topic: quizConfig.topic,
          score,
          total_questions: questions.length,
          questions,
          answers: newAnswers,
        });
      }

      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      saveProgress();
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setError(null);
    setQuizConfig(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold">Quizzer</h1>
          <p className="mt-2 text-lg text-gray-400">Test your knowledge on any topic!</p>
        </div>

        <div className="flex justify-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
              <p className="mt-4 text-gray-400">Generating your quiz...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-400">{error}</p>
              <button
                onClick={handleRestart}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-indigo-500 hover:bg-indigo-400"
              >
                Try Again
              </button>
            </div>
          ) : questions.length === 0 ? (
            <QuizSetup
              onStart={handleStart}
              onResume={handleResume}
              hasProgress={!!localStorage.getItem(LOCAL_STORAGE_KEY)}
            />
          ) : userAnswers.length === questions.length ? (
            <QuizResults
              questions={questions}
              userAnswers={userAnswers}
              onRestart={handleRestart}
              onReassess={handleReassess}
            />
          ) : (
            <QuizQuestion
              question={questions[currentQuestion]}
              onAnswer={handleAnswer}
              currentQuestion={currentQuestion}
              totalQuestions={questions.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}
