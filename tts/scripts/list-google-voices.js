require('dotenv').config();
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');

async function listGoogleVoices() {
  try {
    console.log('🔍 Obteniendo voces oficiales de Google TTS...\n');
    
    // Crear cliente con configuración
    const clientOptions = {};
    if (process.env.GOOGLE_API_KEY) {
      clientOptions.apiKey = process.env.GOOGLE_API_KEY;
    }
    
    const client = new TextToSpeechClient(clientOptions);
    
    // Obtener lista de voces
    const [result] = await client.listVoices({});
    const voices = result.voices;
    
    // Filtrar solo voces en español
    const spanishVoices = voices.filter(voice => 
      voice.languageCodes.some(code => 
        code.startsWith('es-ES') || code.startsWith('es-')
      )
    );
    
    console.log(`📊 Total de voces encontradas: ${voices.length}`);
    console.log(`🇪🇸 Voces en español: ${spanishVoices.length}\n`);
    
    // Agrupar por tipo de voz
    const neural2Voices = spanishVoices.filter(voice => 
      voice.name.includes('Neural2')
    );
    
    const standardVoices = spanishVoices.filter(voice => 
      !voice.name.includes('Neural2') && !voice.name.includes('Wavenet')
    );
    
    const wavenetVoices = spanishVoices.filter(voice => 
      voice.name.includes('Wavenet')
    );
    
    console.log('🤖 NEURAL2 VOICES (Recomendadas):');
    console.log('=====================================');
    neural2Voices.forEach(voice => {
      console.log(`Name: ${voice.name}`);
      console.log(`Gender: ${voice.ssmlGender}`);
      console.log(`Language: ${voice.languageCodes.join(', ')}`);
      console.log('---');
    });
    
    console.log('\n🌊 WAVENET VOICES:');
    console.log('==================');
    wavenetVoices.forEach(voice => {
      console.log(`Name: ${voice.name}`);
      console.log(`Gender: ${voice.ssmlGender}`);
      console.log(`Language: ${voice.languageCodes.join(', ')}`);
      console.log('---');
    });
    
    console.log('\n📢 STANDARD VOICES:');
    console.log('===================');
    standardVoices.forEach(voice => {
      console.log(`Name: ${voice.name}`);
      console.log(`Gender: ${voice.ssmlGender}`);
      console.log(`Language: ${voice.languageCodes.join(', ')}`);
      console.log('---');
    });
    
    // Generar SQL para insertar voces Neural2
    console.log('\n💾 SQL para actualizar base de datos (solo Neural2):');
    console.log('====================================================');
    
    neural2Voices.forEach((voice, index) => {
      const description = `Voz ${voice.ssmlGender.toLowerCase() === 'male' ? 'masculina' : 'femenina'} española Neural2 de alta calidad`;
      const friendlyName = `${voice.name.split('-').pop()} (Neural2)`;
      
      console.log(`  {
    name: '${friendlyName}',
    voice_id: '${voice.name}',
    provider: 'google',
    language: '${voice.languageCodes[0]}',
    gender: '${voice.ssmlGender.toLowerCase()}',
    description: '${description}'
  }${index < neural2Voices.length - 1 ? ',' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Consejos:');
    console.log('- Verifica que GOOGLE_API_KEY esté configurada en .env');
    console.log('- O configura GOOGLE_APPLICATION_CREDENTIALS con la ruta al JSON');
  }
}

listGoogleVoices();