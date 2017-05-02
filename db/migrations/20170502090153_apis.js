exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('apis', (table) => {
      table.increments()
      table.string('well_id')
    })
    .createTable('api_docs', (table) => {
      table.increments()
      table.sting('doc_type')
      table.string('doc_link')
    })
};

exports.down = function(knex, Promise) {

};


exports.up = function(knex, Promise) {
  return knex.schema.createTable('tricks', (table) => {
      table.increments();
      table.string('name');
    })
    .createTable('types', (table) => {
      table.increments();
      table.string('type');
    })
    .createTable('animals', (table) => {
      table.increments();
      table.string('name').notNullable()
      table.integer('age').notNullable();
      table.string('gender').notNullable();
      table.string('species').notNullable();
      table.string('img').notNullable();
      table.integer('type_id').unsigned().references('types.id');
    })
    .createTable('keepers', (table) => {
      table.increments();
      table.string('name').notNullable()
      table.integer('age').notNullable();
      table.string('gender').notNullable();
      table.string('bio').notNullable();
      table.string('img').notNullable();
      table.string('shift').notNullable();
    })
    .createTable('trainers', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.integer('age').notNullable();
      table.string('gender').notNullable();
      table.string('bio').notNullable();
      table.string('img').notNullable();
    })
    .createTable('animals_tricks', (table) => {
      table.increments();
      table.integer('animal_id').unsigned().references('animals.id');
      table.integer('trick_id').unsigned().references('tricks.id');
    })
    .createTable('trainers_tricks', (table) => {
      table.increments();
      table.integer('trainer_id').unsigned().references('trainers.id');
      table.integer('trick_id').unsigned().references('tricks.id');
    })
    .createTable('trainers_types', (table) => {
      table.increments();
      table.integer('trainer_id').unsigned().references('trainers.id');
      table.integer('type_id').unsigned().references('types.id');
    })
    .createTable('keepers_animals', (table) => {
      table.increments();
      table.integer('keeper_id').unsigned().references('keepers.id');
      table.integer('animal_id').unsigned().references('animals.id');
    })
};

exports.down = (knex, Promise) =>
  knex.schema
  .dropTable('keepers_animals')
  .dropTable('trainers_types')
  .dropTable('trainers_tricks')
  .dropTable('animals_tricks')
  .dropTable('trainers')
  .dropTable('keepers')
  .dropTable('animals')
  .dropTable('types')
  .dropTable('tricks')
