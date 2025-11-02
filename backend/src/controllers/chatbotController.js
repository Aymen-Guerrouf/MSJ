import { generateChatResponse } from '../services/chatbotServices.js';

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
console.log(message);

    // Validation
    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Generate AI response
    const aiResponse = await generateChatResponse(message);

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chatbot Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate response',
      message: error.message,
    });
  }
};
export const getChatbotInfo = async (req, res) => {
  res.json({
    success: true,
    model: 'meta-llama/Llama-3.1-8B',
    provider: 'featherless-ai',
    status: 'active',
  });
};
