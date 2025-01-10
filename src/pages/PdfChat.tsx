import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Upload, X } from 'lucide-react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import { generatePdfChat } from '../services/groq';
import ReactMarkdown from 'react-markdown';
import 'pdfjs-dist/build/pdf.worker.mjs';

// Set worker path
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function PdfChat() {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfText, setPdfText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file');
      return;
    }

    try {
      setUploading(true);
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }

      setPdfText(fullText);
      await pdf.destroy();
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfText) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await generatePdfChat(pdfText, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <MessageSquare className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-2 text-3xl font-bold text-white">Chat with PDF</h2>
          <p className="mt-2 text-lg text-gray-400">
            Upload a PDF and ask questions about its content
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* PDF Preview */}
          <div className="lg:w-1/2">
            {!pdfUrl ? (
              <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[600px]">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <label className="cursor-pointer">
                  <span className="mt-2 text-base leading-normal px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    {uploading ? 'Processing...' : 'Upload PDF'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </label>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-[600px]">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>

          {/* Chat Interface */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex-1 bg-black rounded-lg shadow-md p-4 mb-4 min-h-[500px] max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'user'
                          ? 'bg-gray-300 text-black'
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          className="prose prose-sm max-w-none text-white"
                          components={{
                            strong: ({ node, ...props }) => (
                              <span className="font-semibold" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                              <blockquote
                                className="border-l-4 border-gray-300 pl-4 italic"
                                {...props}
                              />
                            ),
                            ul: ({ node, ...props }) => (
                              <ul className="list-disc pl-4 space-y-1" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                              <h3
                                className="text-lg font-semibold mt-2 mb-1"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 rounded-lg px-4 py-2 text-white">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={pdfText ? 'Ask a question...' : 'Upload a PDF first'}
                disabled={!pdfText || loading}
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-black"
              />
              <button
                type="submit"
                disabled={!pdfText || loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
