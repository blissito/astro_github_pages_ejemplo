const db = require('../database/db');
const path = require('path');
const fs = require('fs');

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Verificar si la base de datos existe y tiene tablas
    try {
      const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table'");
      const tableNames = tables.map(t => t.name);
      
      console.log(`📊 Found ${tableNames.length} tables:`, tableNames);
      
      // Si no hay tablas o falta la tabla voices, ejecutar migraciones
      if (tableNames.length === 0 || !tableNames.includes('voices')) {
        console.log('🚀 Running migrations...');
        await db.migrate.latest();
        console.log('✅ Migrations completed');
        
        // Verificar si la tabla voices está vacía
        const voiceCount = await db('voices').count('* as count').first();
        if (voiceCount.count === 0) {
          console.log('🌱 Seeding database...');
          await db.seed.run();
          console.log('✅ Database seeded');
        } else {
          console.log(`📝 Found ${voiceCount.count} voices in database`);
        }
      } else {
        console.log('✅ Database already initialized');
      }
    } catch (error) {
      console.log('❌ Database check failed, running full initialization...');
      await db.migrate.latest();
      await db.seed.run();
      console.log('✅ Database initialized');
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

module.exports = initializeDatabase;

// Si se ejecuta directamente
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('🎉 Database initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}