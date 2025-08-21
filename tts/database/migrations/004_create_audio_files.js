exports.up = function(knex) {
  return knex.schema.createTable('audio_files', table => {
    table.increments('id').primary();
    table.string('file_id').unique().notNullable();
    table.string('file_path').notNullable();
    table.string('format').defaultTo('mp3');
    table.integer('size_bytes');
    table.integer('duration_seconds');
    table.integer('history_id').unsigned().references('id').inTable('tts_history').onDelete('CASCADE');
    table.timestamps(true, true);
    
    table.index('file_id');
    table.index('history_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audio_files');
};