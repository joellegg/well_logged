exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('api_docs', (table) => {
      table.increments()
      table.string('api')
      table.string('api_abv')
      table.string('doc_type')
      table.string('doc_link')
    })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('api_docs')
};
