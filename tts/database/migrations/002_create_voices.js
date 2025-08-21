exports.up = function(knex) {
  return knex.schema.createTable('voices', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('voice_id').unique().notNullable();
    table.string('provider').notNullable();
    table.string('language');
    table.string('gender');
    table.text('description');
    table.json('settings').defaultTo('{}');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('voices');
};