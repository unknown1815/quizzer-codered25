import Groq from "groq-sdk";
import type { QuizConfig, Question } from "../types/quiz";

// Ensure GROQ API key is configured
if (!import.meta.env.VITE_GROQ_API_KEY) {
  throw new Error("GROQ API key is not configured");
}

// Initialize GROQ SDK
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Generate multiple-choice questions based on either a topic or provided content.
 * @param {QuizConfig} config - Configuration for quiz generation.
 * @returns {Promise<Question[]>} - List of generated questions.
 */
export async function generateQuestions(
  config: QuizConfig
): Promise<Question[]> {
  try {
    // Determine prompt based on config structure
    const prompt =
      "pdfContent" in config
        ? `Based on the following content, generate ${config.numQuestions} multiple choice questions at ${config.difficulty} difficulty level. Make sure the questions are directly related to the content provided.

Content:
${config.pdfContent}

Format the response as a JSON array with each question having the following structure:
{
  "question": "the question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "the correct option",
  "explanation": "explanation why this is the correct answer"
}`
        : `Generate ${config.numQuestions} multiple choice questions about ${config.topic} at ${config.difficulty} difficulty level. Format the response as a JSON array with each question having the following structure:
{
  "question": "the question text",
  "options": ["option1", "option2", "option3", "option4"],
  "correctAnswer": "the correct option",
  "explanation": "explanation why this is the correct answer"
}`;

    // Make API call to generate questions
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0]?.message?.content || "[]";
    return JSON.parse(response);
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate questions");
  }
}

/**
 * Generate a professional response to user queries based on provided PDF content.
 * @param {string} pdfContent - Content extracted from a PDF.
 * @param {string} userQuestion - User's question about the PDF content.
 * @returns {Promise<string>} - Generated response to the user's question.
 */
export async function generatePdfChat(
  pdfContent: string,
  userQuestion: string
): Promise<string> {
  try {
    const systemPrompt = `You are a professional AI assistant specialized in analyzing PDF documents. Your responses should be:
1. Well-structured with clear sections when appropriate
2. Concise yet comprehensive
3. Professional in tone
4. Include relevant quotes from the document when applicable (in quotation marks)
5. Always cite specific sections or pages if you can identify them
6. If information is not found in the document, clearly state that

Use the following PDF content to answer questions:

${pdfContent}

Format longer responses with appropriate Markdown:
- Use **bold** for emphasis
- Use bullet points for lists
- Use > for quotes from the document
- Use ### for section headers if needed`;

    // Make API call to generate chat response
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userQuestion },
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.7,
      max_tokens: 2048,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I couldn't generate a response."
    );
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error("Failed to generate response");
  }
}
