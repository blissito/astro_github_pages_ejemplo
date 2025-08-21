const logger = require('../utils/logger');

class TextEnhancer {
  enhanceText(text) {
    try {
      let enhanced = text;
      
      enhanced = enhanced.replace(/\s+/g, ' ').trim();
      
      enhanced = enhanced.replace(/([.!?])\s*([a-z])/g, (match, punct, letter) => {
        return punct + ' ' + letter.toUpperCase();
      });
      
      enhanced = enhanced.replace(/([,;:])\s*/g, '$1 ');
      
      enhanced = enhanced.replace(/\s+([.!?,:;])/g, '$1');
      
      enhanced = enhanced.replace(/(\w)([.!?])(\w)/g, '$1$2 $3');
      
      const contractions = {
        "don't": "do not",
        "won't": "will not",
        "can't": "cannot",
        "n't": " not",
        "'re": " are",
        "'ve": " have",
        "'ll": " will",
        "'d": " would"
      };
      
      Object.entries(contractions).forEach(([contraction, expansion]) => {
        const regex = new RegExp(contraction, 'gi');
        enhanced = enhanced.replace(regex, expansion);
      });
      
      enhanced = enhanced.replace(/([.!?])\s*$/, '$1');
      
      if (enhanced && !enhanced.match(/[.!?]$/)) {
        enhanced += '.';
      }
      
      return enhanced;
    } catch (error) {
      logger.error('Text enhancement error:', error);
      return text;
    }
  }

  addPauses(text) {
    try {
      let enhanced = text;
      
      enhanced = enhanced.replace(/([.!?])/g, '$1 <break time="0.5s"/>');
      enhanced = enhanced.replace(/([,;:])/g, '$1 <break time="0.3s"/>');
      enhanced = enhanced.replace(/\n\n/g, ' <break time="1s"/> ');
      enhanced = enhanced.replace(/\n/g, ' <break time="0.5s"/> ');
      
      return enhanced;
    } catch (error) {
      logger.error('Pause enhancement error:', error);
      return text;
    }
  }

  generateSSML(text, options = {}) {
    try {
      const { emotion = 'neutral', rate = 'medium', pitch = 'medium' } = options;
      
      let enhanced = this.enhanceText(text);
      enhanced = this.addPauses(enhanced);
      
      const ssml = `<speak>
        <prosody rate="${rate}" pitch="${pitch}">
          ${enhanced}
        </prosody>
      </speak>`;
      
      return ssml;
    } catch (error) {
      logger.error('SSML generation error:', error);
      return text;
    }
  }

  detectLanguage(text) {
    try {
      const spanishWords = ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le', 'da', 'su', 'por', 'son', 'con', 'para', 'al'];
      const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir', 'que', 'pour', 'dans', 'ce', 'son', 'une', 'sur', 'avec', 'ne', 'se'];
      const germanWords = ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich', 'des', 'auf', 'für', 'ist', 'im', 'dem', 'nicht', 'ein', 'eine', 'als'];
      
      const words = text.toLowerCase().split(/\s+/);
      const spanishCount = words.filter(word => spanishWords.includes(word)).length;
      const frenchCount = words.filter(word => frenchWords.includes(word)).length;
      const germanCount = words.filter(word => germanWords.includes(word)).length;
      
      if (spanishCount > 2) return 'es';
      if (frenchCount > 2) return 'fr';
      if (germanCount > 2) return 'de';
      
      return 'en';
    } catch (error) {
      logger.error('Language detection error:', error);
      return 'en';
    }
  }
}

module.exports = new TextEnhancer();