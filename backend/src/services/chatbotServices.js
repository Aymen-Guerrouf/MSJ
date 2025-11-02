// src/services/chatbotService.js
import Groq from 'groq-sdk';
import config from '../config/index.js'

const groq = new Groq({
  apiKey: config.hf_key.key || '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',
});

export const generateChatResponse = async (userMessage) => {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Groq Error:', error);
    throw error;
  }
};
