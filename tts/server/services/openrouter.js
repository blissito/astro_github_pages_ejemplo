const axios = require('axios');
const logger = require('../utils/logger');

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

class OpenRouterService {
  constructor() {
    this.client = axios.create({
      baseURL: OPENROUTER_API_URL,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'TTS Application',
        'Content-Type': 'application/json'
      }
    });
  }

  async enhanceText(text) {
    try {
      const prompt = `Enhance the following text for text-to-speech conversion. 
      Make it more natural, add appropriate pauses, and fix any grammatical issues.
      Keep the meaning and tone intact. Return only the enhanced text without any explanation.
      
      Text: ${text}`;

      const response = await this.client.post('', {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a text enhancement assistant specialized in preparing text for natural-sounding text-to-speech conversion.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      logger.error('OpenRouter API error:', error.response?.data || error.message);
      throw new Error('Failed to enhance text');
    }
  }

  async generateSSML(text, options = {}) {
    try {
      const { emotion = 'neutral', emphasis = 'moderate' } = options;
      
      const prompt = `Convert the following text to SSML (Speech Synthesis Markup Language) format.
      Add appropriate prosody, emphasis, and breaks for natural speech.
      Emotion: ${emotion}
      Emphasis level: ${emphasis}
      
      Text: ${text}
      
      Return only the SSML markup without explanation.`;

      const response = await this.client.post('', {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SSML expert. Generate valid SSML markup for text-to-speech systems.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      logger.error('SSML generation error:', error.response?.data || error.message);
      throw new Error('Failed to generate SSML');
    }
  }

  async detectLanguage(text) {
    try {
      const prompt = `Detect the language of the following text and return only the ISO 639-1 language code (e.g., 'en', 'es', 'fr'): "${text}"`;

      const response = await this.client.post('', {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0,
        max_tokens: 10
      });

      return response.data.choices[0].message.content.trim().toLowerCase();
    } catch (error) {
      logger.error('Language detection error:', error.response?.data || error.message);
      return 'en';
    }
  }
}

module.exports = new OpenRouterService();