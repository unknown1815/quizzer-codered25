import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { History as HistoryIcon, X } from 'lucide-react';
import QuizResults from '../components/QuizResults';

interface QuizHistory {
  id: string;
  topic: string;
  score: number;
  total_questions: number;
  created_at: string;
  questions: any[];
  answers: string[];
}

export default function History() {
  const [history, setHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizHistory | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setHistory(data);
      }
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-white">Loading your quiz history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <HistoryIcon className="mx-auto h-12 w-12 text-white" />
          <h2 className="mt-2 text-3xl font-bold text-white">Your Quiz History</h2>
        </div>

        {selectedQuiz ? (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Quiz Details: {selectedQuiz.topic}
              </h3>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <QuizResults
              questions={selectedQuiz.questions}
              userAnswers={selectedQuiz.answers}
              onRestart={() => setSelectedQuiz(null)}
              isHistoryView={true}
            />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>You haven't taken any quizzes yet.</p>
          </div>
        ) : (
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-700">
              {history.map((quiz) => (
                <li 
                  key={quiz.id}
                  onClick={() => setSelectedQuiz(quiz)}
                  className="hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-400 truncate">
                          {quiz.topic}
                        </p>
                        <p className="mt-1 text-sm text-gray-400">
                          Score: {quiz.score} / {quiz.total_questions}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-400">
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
