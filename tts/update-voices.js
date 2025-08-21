const db = require('./database/db');

async function updateVoices() {
  try {
    console.log('Updating voices...');

    // Limpiar voces existentes
    await db('voices').del();

    // Insertar nuevas voces de Google TTS
    await db('voices').insert([
      {
        name: 'Laura (Neural2)',
        voice_id: 'en-US-Neural2-A',
        provider: 'google',
        language: 'en-US',
        gender: 'female',
        description: 'A clear and natural American female voice'
      },
      {
        name: 'Michael (Neural2)',
        voice_id: 'en-US-Neural2-D',
        provider: 'google',
        language: 'en-US',
        gender: 'male',
        description: 'A warm and professional American male voice'
      },
      {
        name: 'Emma (Neural2)',
        voice_id: 'en-US-Neural2-F',
        provider: 'google',
        language: 'en-US',
        gender: 'female',
        description: 'A friendly American female voice'
      },
      {
        name: 'James (Neural2)',
        voice_id: 'en-US-Neural2-J',
        provider: 'google',
        language: 'en-US',
        gender: 'male',
        description: 'A confident American male voice'
      },
      {
        name: 'Sofia (Neural2)',
        voice_id: 'es-ES-Neural2-A',
        provider: 'google',
        language: 'es-ES',
        gender: 'female',
        description: 'Una voz femenina española clara y natural'
      },
      {
        name: 'Carlos (Neural2)',
        voice_id: 'es-ES-Neural2-B',
        provider: 'google',
        language: 'es-ES',
        gender: 'male',
        description: 'Una voz masculina española profesional'
      },
      {
        name: 'Amelie (Neural2)',
        voice_id: 'fr-FR-Neural2-A',
        provider: 'google',
        language: 'fr-FR',
        gender: 'female',
        description: 'Une voix féminine française élégante'
      },
      {
        name: 'Hans (Neural2)',
        voice_id: 'de-DE-Neural2-B',
        provider: 'google',
        language: 'de-DE',
        gender: 'male',
        description: 'Eine klare deutsche männliche Stimme'
      }
    ]);

    console.log('Voices updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
}

updateVoices();