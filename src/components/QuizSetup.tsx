import React, { useState } from "react";
import { Settings, Upload } from "lucide-react";
import type { QuizConfig } from "../types/quiz";
import { extractTextFromPdf } from "../utils/pdfExtractor";

interface Props {
  onStart: (config: QuizConfig) => void;
  onResume: () => void;
  hasProgress: boolean; // Indicates if there is saved progress
}

export default function QuizSetup({ onStart, onResume, hasProgress }: Props) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizType, setQuizType] = useState<"topic" | "pdf">("topic");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (quizType === "pdf" && pdfFile) {
        const pdfText = await extractTextFromPdf(pdfFile);
        onStart({
          topic: pdfFile.name,
          difficulty,
          numQuestions,
          pdfContent: pdfText,
        });
      } else {
        onStart({ topic, difficulty, numQuestions });
      }
    } catch (error) {
      setError("Error processing PDF file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-gray-900 rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white">Quiz Setup</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setQuizType("topic")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              quizType === "topic"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Topic/Code Snippet
          </button>
          <button
            type="button"
            onClick={() => setQuizType("pdf")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
              quizType === "pdf"
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            From PDF
          </button>
        </div>

        {hasProgress && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onResume}
              className="w-full py-2 px-4 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 focus:ring-2 focus:ring-blue-400"
            >
              Resume Quiz
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {quizType === "topic" ? (
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-300"
            >
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Upload PDF
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-300">
                  <label
                    htmlFor="pdf-upload"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Upload a file</span>
                    <input
                      id="pdf-upload"
                      name="pdf-upload"
                      type="file"
                      accept=".pdf"
                      className="sr-only"
                      onChange={handlePdfChange}
                      required={quizType === "pdf"}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
                {pdfFile && (
                  <p className="text-sm text-gray-300">{pdfFile.name}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-300"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="numQuestions"
            className="block text-sm font-medium text-gray-300"
          >
            Number of Questions
          </label>
          <input
            type="number"
            id="numQuestions"
            min="1"
            max="10"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading || (quizType === "pdf" && !pdfFile)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Start Quiz"}
        </button>
      </form>
    </div>
  );
}
