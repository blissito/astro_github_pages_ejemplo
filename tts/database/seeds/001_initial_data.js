const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Limpiar datos existentes
  await knex('voices').del();
  await knex('users').del();

  // Voces oficiales de Google TTS Neural2 en español
  await knex('voices').insert([
      {
        name: 'Elena (Neural2)',
        voice_id: 'es-ES-Neural2-A',
        provider: 'google',
        language: 'es-ES',
        gender: 'female',
        description: 'Voz femenina española Neural2 de alta calidad - Elena'
      },
      {
        name: 'Carmen (Neural2)',
        voice_id: 'es-ES-Neural2-E',
        provider: 'google',
        language: 'es-ES',
        gender: 'female',
        description: 'Voz femenina española Neural2 de alta calidad - Carmen'
      },
      {
        name: 'Pablo (Neural2)',
        voice_id: 'es-ES-Neural2-F',
        provider: 'google',
        language: 'es-ES',
        gender: 'male',
        description: 'Voz masculina española Neural2 de alta calidad - Pablo'
      },
      {
        name: 'Diego (Neural2)',
        voice_id: 'es-ES-Neural2-G',
        provider: 'google',
        language: 'es-ES',
        gender: 'male',
        description: 'Voz masculina española Neural2 de alta calidad - Diego'
      },
      {
        name: 'Sofía (Neural2)',
        voice_id: 'es-ES-Neural2-H',
        provider: 'google',
        language: 'es-ES',
        gender: 'female',
        description: 'Voz femenina española Neural2 de alta calidad - Sofía'
      }
  ]);

  const hashedPassword = await bcrypt.hash('demo123', 10);
  await knex('users').insert({
      email: 'demo@example.com',
      password_hash: hashedPassword,
      name: 'Demo User',
    preferences: JSON.stringify({
      defaultVoice: 'es-ES-Neural2-A',
      defaultSpeed: 1.0,
      autoEnhance: false
    })
  });
};