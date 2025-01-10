import React from "react";
import { Link } from "react-router-dom";
import { Book, Brain, History, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            QuizMaster
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Test your knowledge, track your progress, and challenge yourself
            with our interactive quizzes.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Brain className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Take a Quiz
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Choose from various topics and test your knowledge with our
                    adaptive quizzes.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/quiz"
                      className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Start Quiz
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <History className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    View History
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Track your progress and review your past quiz performances.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/history"
                      className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      View History
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Book className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Resources
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Upload and view resources to boost your preparation.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/resources"
                      className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      View Resources
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6">
              <div className="flow-root bg-white rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                      <Trophy className="h-6 w-6 text-white" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Achievements
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Earn achievements and track your learning milestones.
                  </p>
                  <div className="mt-6">
                    <button
                      className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                      disabled
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}