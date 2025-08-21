exports.up = function(knex) {
  return knex.schema.createTable('tts_history', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.text('input_text').notNullable();
    table.text('enhanced_text');
    table.integer('voice_id').unsigned().references('id').inTable('voices');
    table.string('audio_file_path');
    table.integer('duration_seconds');
    table.integer('character_count');
    table.json('settings');
    table.string('status').defaultTo('pending');
    table.timestamps(true, true);
    
    table.index('user_id');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tts_history');
};